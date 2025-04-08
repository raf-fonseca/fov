"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useState, useRef, useEffect } from "react";

import * as THREE from "three";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { RxCross2 } from "react-icons/rx";
import { Slider } from "../ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ArrowRight } from "lucide-react";

function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    crop.width,
    crop.height
  );
}

interface ImageEditorProps {
  imageSrc: string;
  onSave: (editedImage: string) => void;
  onClose: () => void;
  open: boolean;
}

const ImageEditor = ({ imageSrc, onSave, onClose, open }: ImageEditorProps) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
  ) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 100,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 16 / 9));
  }

  const handleSave = () => {
    if (completedCrop && previewCanvasRef.current && imgRef.current) {
      canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      const dataUrl = previewCanvasRef.current.toDataURL("image/png");
      onSave(dataUrl);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#040911] border-none w-[608px] h-[600px]">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <DialogTitle className="text-white">Edit Image</DialogTitle>
            <button onClick={onClose} className="text-white">
              <RxCross2 size={20} />
            </button>
          </div>

          <div className="flex-1 relative">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={16 / 9}
              className="max-h-[400px]"
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imageSrc}
                onLoad={onImageLoad}
                className="max-h-[400px] object-contain"
              />
            </ReactCrop>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-primary-50 text-primary-50 hover:bg-primary-50/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary-50 hover:bg-primary-50/70"
            >
              Save Changes
            </Button>
          </div>

          <canvas ref={previewCanvasRef} style={{ display: "none" }} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

type ModelProps = {
  setImageTexture: (mesh: THREE.Mesh) => void;
  setCameraTarget: (target: THREE.Vector3) => void;
  id: number;
};

const Model = ({ setImageTexture, setCameraTarget, id }: ModelProps) => {
  const { scene } = useGLTF(`/scene${id}.glb`);
  const bannerMeshRef = useRef<THREE.Mesh | null>(null);

  scene.traverse((node) => {
    if (
      node instanceof THREE.Mesh &&
      node.name === `${id === 1 ? "Plane009" : "Plane008"}` &&
      !bannerMeshRef.current
    ) {
      node.userData.clickable = true;
      node.castShadow = true;
      node.receiveShadow = true;
      bannerMeshRef.current = node;

      console.log("✅ Banner Mesh Found:", node.name);
      setCameraTarget(node.position.clone());
      setImageTexture(node);
    }
  });

  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    const clickedObject = event.intersections.find(
      (obj: { object: THREE.Object3D }) =>
        obj.object.name === `${id === 1 ? "Plane009" : "Plane008"}`
    );
    if (clickedObject) {
      console.log("✅ Banner Clicked!", clickedObject.object.name);
      setImageTexture(clickedObject.object as THREE.Mesh);
    }
  };

  return (
    <primitive
      object={scene.clone()}
      scale={1}
      onPointerDown={handlePointerDown}
    />
  );
};

type CameraControllerProps = {
  cameraTarget: THREE.Vector3 | null;
  setCameraLocked: (locked: boolean) => void;
  setOrbitTarget: (target: THREE.Vector3) => void;
};

const CameraController = ({
  cameraTarget,
  setCameraLocked,
  setOrbitTarget,
}: CameraControllerProps) => {
  const frameRef = useRef(0);

  useFrame(({ camera }) => {
    if (cameraTarget && frameRef.current < 100) {
      frameRef.current++;
      const targetPos = new THREE.Vector3(
        cameraTarget.x,
        cameraTarget.y + 5,
        cameraTarget.z + 12
      );
      camera.position.lerp(targetPos, 0.08);
      camera.lookAt(cameraTarget);

      if (frameRef.current === 100) {
        console.log("✅ Camera locked on banner.");
        setTimeout(() => {
          setCameraLocked(false);
          setOrbitTarget(cameraTarget);
        }, 2000);
      }
    }
  });

  return null;
};

const ModelComponent = ({ id }: { id: number }) => {
  const [cameraTarget, setCameraTarget] = useState<THREE.Vector3 | null>(null);
  const [showCanvas, setShowCanvas] = useState(true);
  const [loading, setLoading] = useState(true);
  const [bannerMesh, setBannerMesh] = useState<THREE.Mesh | null>(null);
  const [step, setStep] = useState(1);
  const [openCart, setOpenCart] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string | null>(null);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, [id]);

  useEffect(() => {
    setCameraTarget(null);
    setShowCanvas(false);
    setTimeout(() => setShowCanvas(true), 10);
    setStep(1);
  }, [id]);

  const [cameraLocked, setCameraLocked] = useState(true);
  const orbitControlsRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showSlots, setShowSlots] = useState(false);

  useEffect(() => {
    if (bannerMesh) {
      console.log("Mesh UVs:", bannerMesh.geometry.attributes.uv.array);
      console.log("Mesh Scale:", bannerMesh.scale);
      console.log("Mesh Dimensions:", {
        width: bannerMesh.geometry.parameters?.width,
        height: bannerMesh.geometry.parameters?.height,
      });
    }
  }, [bannerMesh]);

  const handleImageUpload = (mesh: THREE.Mesh, file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCurrentImageSrc(dataUrl); // Update the state
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(event.target?.result as string, (texture) => {
        // Configure texture properties
        texture.flipY = false;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        texture.offset.set(0, 0);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        // Create material with the texture
        const material = new THREE.MeshStandardMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          alphaTest: 0.5,
        });

        // Apply to mesh
        mesh.material = material;
        mesh.material.needsUpdate = true;
        setStep(2);
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: Event, mesh: THREE.Mesh) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      handleImageUpload(mesh, file);
    }
  };

  const triggerFileInput = (mesh: THREE.Mesh) => {
    if (!fileInputRef.current) {
      fileInputRef.current = document.createElement("input");
      fileInputRef.current.type = "file";
      fileInputRef.current.accept = "image/*";
      fileInputRef.current.style.display = "none";
      document.body.appendChild(fileInputRef.current);
    }

    fileInputRef.current.onchange = (e: Event) =>
      handleFileInputChange(e, mesh);
    fileInputRef.current.click();
  };

  const setOrbitTarget = (target: THREE.Vector3) => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.target.copy(target);
      orbitControlsRef.current.update();
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }} className="relative z-30">
      {showCanvas && (
        <Canvas
          camera={{ position: [0, 8, 15], fov: 100 }}
          shadows
          className="z-20"
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <Suspense fallback={null}>
            <Model
              setImageTexture={(mesh) => setBannerMesh(mesh)}
              setCameraTarget={setCameraTarget}
              id={id}
            />
          </Suspense>
          <CameraController
            cameraTarget={cameraTarget}
            setCameraLocked={setCameraLocked}
            setOrbitTarget={setOrbitTarget}
          />
          <OrbitControls
            ref={orbitControlsRef}
            enabled={!cameraLocked}
            enableZoom
            enablePan
            enableRotate
            minDistance={5}
            maxDistance={50}
            enableDamping
          />
        </Canvas>
      )}

      <div className="absolute inset-0 flex items-center z-10 flex-col gap-4 justify-center ">
        <Image
          src="/logo.svg"
          alt="logo"
          width={100}
          height={100}
          className="animate-pulse"
        />
        <p className="text-white text-lg pb-12">Loading Model</p>
      </div>

      {step === 1 && (
        <div className="hidden lg:flex absolute right-8 bottom-16 flex-col gap-3 z-40 sm:w-fit px-2 w-full">
          <div className="bg-[#040911] sm:w-[400px] p-6 border border-[#FFFFFF33] rounded-[12px] flex items-start gap-2.5 justify-evenly flex-col">
            <p className="2xl:text-xl text-lg font-semibold text-white">
              Visualize your Ad Creative
            </p>
            <p className="text-sm text-primary-500">Image, Video, or 3D File</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary-50 mt-4 inner-shadow flex items-center gap-2 hover:bg-primary-50/70 w-full px-4 2xl:px-6 font-semibold text-xs xl:text-sm text-white py-2.5 2xl:py-3 rounded-md">
                  Upload{" "}
                  <Image
                    src="/share.svg"
                    width={25}
                    height={25}
                    alt="hehe"
                    className="2xl:w-6 2xl:h-6"
                  />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="bg-[#040911] border-none w-[608px] h-[375px] "
                style={{
                  backgroundImage: "url(/upload_bg.svg)",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <div
                  className=" flex items-center justify-center"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add(
                      "border-2",
                      "border-primary-50"
                    );
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove(
                      "border-2",
                      "border-primary-50"
                    );
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove(
                      "border-2",
                      "border-primary-50"
                    );

                    const file = e.dataTransfer.files[0];
                    if (file && file.type.match("image.*") && bannerMesh) {
                      handleImageUpload(bannerMesh, file);
                    }
                  }}
                >
                  <Button
                    onClick={() => bannerMesh && triggerFileInput(bannerMesh)}
                    className="bg-primary-50 w-full h-full  opacity-0  inner-shadow flex items-center gap-2 hover:bg-primary-50/70 mx-auto px-4 2xl:px-6 font-semibold text-xs xl:text-sm text-white py-2.5 2xl:py-3 rounded-md"
                  >
                    Select File
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button className="bg-[#2B3443] hover:bg-[#2B3443]/50 flex items-center gap-2 w-full px-4 2xl:px-6 font-semibold text-xs 2xl:text-sm text-white py-2.5 2xl:py-3 rounded-md">
              Check Guidelines
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div
          className="absolute right-10 z-50 top-16 bg-[#0B111B] border border-[#FFFFFF33] rounded-[12px] overflow-hidden transition-all duration-300"
          style={{
            width: "fit-content",
            maxHeight: showSlots ? "80vh" : "auto",
          }}
        >
          <div className="xl:w-[400px] p-3.5 xl:px-5 2xl:px-6 flex flex-col items-start">
            <div className="flex w-full items-center gap-4 justify-start">
              <button onClick={() => setShowSlots(!showSlots)}>
                <Image
                  src="/toggle.svg"
                  width={20}
                  height={20}
                  alt="info"
                  className="2xl:w-5 2xl:h-5"
                />
              </button>
              <p className="2xl:text-xl text-lg font-semibold text-white">
                About Your Media
              </p>
            </div>

            <motion.div
              className="w-full overflow-hidden"
              initial={{ height: 0, marginTop: 0, paddingBottom: 0 }}
              animate={{
                height: showSlots ? "auto" : 0,
                marginTop: showSlots ? 20 : 0,
                paddingBottom: showSlots ? 20 : 0,
                maxHeight: showSlots ? "calc(80vh - 80px)" : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div
                className="overflow-y-auto pr-2 "
                style={{ maxHeight: "calc(80vh - 100px)" }}
              >
                <div className="flex items-center mb-3 border-y py-3 border-primary-500 justify-between">
                  <p className="text-sm 2xl:text-base text-white font-semibold">
                    Photo Editor
                  </p>
                  <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
                    <DialogTrigger asChild>
                      <button
                        className="bg-primary-50 text-xs flex items-center inner-shadow gap-2 rounded-[6px] hover:bg-primary-50/70 px-6 font-semibold 2xl:text-base text-white py-1"
                        onClick={() => setEditorOpen(true)}
                      >
                        Edit
                      </button>
                    </DialogTrigger>
                    {bannerMesh?.material?.map?.image?.src && (
                      <ImageEditor
                        imageSrc={bannerMesh.material.map.image.src}
                        onSave={(editedImage) => {
                          const textureLoader = new THREE.TextureLoader();

                          textureLoader.load(editedImage, (texture) => {
                            if (bannerMesh) {
                              // Calculate aspect ratio of the cropped image
                              const img = new Image();
                              img.src = editedImage;
                              img.onload = () => {
                                const imgAspect = img.width / img.height;

                                // Get mesh dimensions (approximate if not available)
                                const meshWidth = bannerMesh.scale.x * 2;
                                const meshHeight = bannerMesh.scale.y * 2;
                                const meshAspect = meshWidth / meshHeight;

                                // Adjust texture repeat based on aspect ratios
                                if (imgAspect > meshAspect) {
                                  // Image is wider than mesh
                                  texture.repeat.set(1, imgAspect / meshAspect);
                                  texture.offset.set(
                                    0,
                                    (1 - meshAspect / imgAspect) / 2
                                  );
                                } else {
                                  // Image is taller than mesh
                                  texture.repeat.set(meshAspect / imgAspect, 1);
                                  texture.offset.set(
                                    (1 - imgAspect / meshAspect) / 2,
                                    0
                                  );
                                }
                                // Set other texture properties
                                texture.flipY = false;
                                texture.wrapS = THREE.ClampToEdgeWrapping;
                                texture.wrapT = THREE.ClampToEdgeWrapping;
                                texture.minFilter = THREE.LinearFilter;
                                texture.magFilter = THREE.LinearFilter;

                                // Create new material
                                const material = new THREE.MeshStandardMaterial(
                                  {
                                    map: texture,
                                    side: THREE.DoubleSide,
                                    transparent: true,
                                    alphaTest: 0.5,
                                  }
                                );

                                // Apply to mesh
                                bannerMesh.material = material;
                                bannerMesh.material.needsUpdate = true;

                                // DEBUGGING CODE GOES HERE
                              };
                            }
                          });
                        }}
                        onClose={() => setEditorOpen(false)}
                        open={editorOpen}
                      />
                    )}
                  </Dialog>
                </div>

                {/* Rest of your step 2 content */}
                <div className="flex items-center mb-3 border-b pb-3 border-primary-500 justify-between">
                  <p className="text-sm 2xl:text-base text-white font-semibold">
                    Change Media
                  </p>

                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="bg-primary-50 text-xs flex items-center inner-shadow gap-2 rounded-[6px] hover:bg-primary-50/70 px-6 font-semibold 2xl:text-base text-white py-1">
                        View
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#08080B] border-none md:min-w-[900px] p-0">
                      <h2 className="text-lg font-bold 2xl:text-xl text-white pt-5 pl-5">
                        Change Media
                      </h2>
                      <div className="flex h-full w-full">
                        {/* Left side - Current Uploaded Image */}
                        <div className="w-1/2 border-r border-[#ffffff13] p-6 flex flex-col">
                          <div className="flex-1 bg-[#141C2A] rounded-lg flex items-center justify-center">
                            {currentImageSrc ||
                            bannerMesh?.material?.map?.image?.src ? (
                              <img
                                src={
                                  currentImageSrc ||
                                  bannerMesh.material.map.image.src
                                }
                                alt="Current Ad"
                                className="max-h-[300px] max-w-full object-contain"
                              />
                            ) : (
                              <p className="text-primary-500">
                                No image uploaded
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right side - Media Library */}
                        <div className="w-1/2 p-6">
                          <h3 className="text-white text-lg font-semibold mb-4">
                            Media Library
                          </h3>

                          {/* Tabs */}
                          <div className="flex border-b px-1 py-1 rounded-sm bg-[#27262B] border-[#FFFFFF33] mb-4">
                            {["All", "Images", "3D Models", "Videos"].map(
                              (tab) => (
                                <button
                                  key={tab}
                                  className={`px-6 rounded-sm py-1.5 flex-grow  text-sm font-medium ${
                                    tab === "Images"
                                      ? "bg-[#08080B] text-white"
                                      : "text-primary-500 hover:text-white"
                                  }`}
                                >
                                  {tab}
                                </button>
                              )
                            )}
                          </div>

                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              bannerMesh && triggerFileInput(bannerMesh);
                            }}
                            className="bg-primary-50 mt-2 inner-shadow flex items-center gap-2 hover:bg-primary-50/70 w-full px-4 2xl:px-6 font-semibold text-xs xl:text-sm text-white py-2.5 2xl:py-3 rounded-md"
                          >
                            Upload New Media
                            <Image
                              src="/share.svg"
                              width={25}
                              height={25}
                              alt="hehe"
                              className="2xl:w-6 2xl:h-6"
                            />
                          </Button>
                          <div className="grid grid-cols-3 mt-4 gap-1.5  overflow-y-auto">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                              <div
                                key={item}
                                className="bg-[#27262B] rounded-md aspect-square flex items-center justify-center cursor-pointer hover:border hover:border-primary-50"
                              >
                                <span className="text-primary-500 text-sm">
                                  Media {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="w-full flex items-start gap-2 justify-evenly flex-col">
                  <div className="px-6 py-5 my-2 rounded-xl border w-full border-[#4BEAA073] bg-[#4BEAA01A]">
                    <div className="flex items-center justify-between border-b mb-4 border-primary-500 pb-4">
                      <h2 className="text-sm 2xl:text-lg font-semibold">
                        AI Summary
                      </h2>
                      <Image src="/logo.svg" alt="ai" width={60} height={60} />
                    </div>
                    <p className="text-sm 2xl:text-base py-1">
                      This ad creative looks perfect!
                    </p>
                    <div className="flex items-end gap-2 mt-4 justify-between">
                      <p className="text-primary-500 text-xs 2xl:text-sm">
                        FOV Score:
                      </p>
                      <p className="text-[#4BEAA0] font-semibold text-3xl 2xl:text-4xl">
                        93%
                      </p>
                    </div>
                  </div>

                  <Link href="/campaign-builder" className="w-full">
                    <Button className="bg-primary-50 mt-4 text-xs flex items-center inner-shadow gap-2 hover:bg-primary-50/70 w-full px-4 2xl:px-6 font-semibold 2xl:text-base text-white py-2.5 2xl:py-3">
                      Campaign Builder
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
      {bannerMesh?.material?.map?.image?.src && (
        <ImageEditor
          imageSrc={bannerMesh.material.map.image.src}
          onSave={(editedImage) => {
            const texture = new THREE.TextureLoader().load(editedImage, () => {
              if (bannerMesh) {
                // Set proper texture properties
                texture.flipY = false;
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1, 1);
                texture.offset.set(0, 0);
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;

                bannerMesh.material.map = texture;
                bannerMesh.material.needsUpdate = true;
              }
            });
          }}
          onClose={() => setEditorOpen(false)}
          open={editorOpen}
        />
      )}
      {/* Rest of your component (step 3 and cart) */}
      {step === 3 && !openCart && (
        <div
          onClick={() => setOpenCart(true)}
          className="hidden cursor-pointer lg:flex absolute right-8 cursor-4ointer top-14 flex-col  gap-3 z-40   sm:w-fit px-2 w-full  "
        >
          <div className="bg-[#040911]    p-6  rounded-[12px] flex items-center gap-3.5 justify-evenly   ">
            <p className="text-xs 2xl:text-sm font-bold inline-flex items-center gap-3 text-white ">
              <Image
                src="/cart.svg"
                width={20}
                height={20}
                alt="hehe"
                className="2xl:w-5 2xl:h-5"
              />
              Campaign:
            </p>
            <p className="text-xs 2xl:text-sm text-primary-500">3 Items</p>
          </div>
        </div>
      )}

      {openCart && (
        <div className="hidden lg:flex flex-col  gap-3  overflow-x-hidden overflow-y-auto  absolute right-4 top-[3.3rem] z-40  sm:w-fit px-2 w-full  ">
          <div className="bg-[#040911] sm:w-[480px]  overflow-hidden   border border-[#FFFFFF33] rounded-[12px] flex items-start gap-4 justify-evenly  flex-col ">
            <div className="p-3.5 2xl:p-5 w-full space-y-2 2xl:space-y-4">
              <div className="flex items-center justify-between gap-4">
                <p className="2xl:text-xl text-lg font-semibold text-white">
                  Your Campaign:
                </p>
                <button onClick={() => setOpenCart(false)}>
                  <RxCross2 className="text-lg" />
                </button>
              </div>

              <div className="h-[30svh]  overflow-x-hidden space-y-3 w-full overflow-y-auto ">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-[#141C2A] w-full p-2.5 xl:px-4 text-white border-none rounded-[12px]"
                  >
                    <div className="flex items-center py-1.5 2xl:py-2.5   justify-between">
                      <p className="text-lg 2xl:text-xl font-semibold mb-1  ">
                        Vault Wall 2
                      </p>
                      <p className="2xl:text-lg font-semibold mb-1  ">
                        $1.5 CPM
                      </p>
                    </div>
                    <div className="flex items-center   py-1.5 2xl:py-2.5   justify-between">
                      <p className="text-xs 2xl:text-base capitalize  text-primary-500">
                        Expected Impressions /mo:
                      </p>
                      <p className=" font-semibold text-[#42E34A]">
                        1.5B - 2.5B/m
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className=" w-full bg-[#141C2A] px-6 py-3.5 2xl:py-5">
              <p className="text-sm font-semibold mb-2 2xl:mb-4 2xl:text-base text-white">
                Projected Results:
              </p>
              <div className="flex items-center  py-0.5 2xl:py-1   justify-between">
                <p className="text-xs 2xl:text-base capitalize  text-primary-500">
                  Duration:
                </p>
                <p className=" font-semibold text-white">1 Month </p>
              </div>
              <div className="flex items-center  py-0.5 2xl:py-1   justify-between">
                <p className="text-xs 2xl:text-base capitalize  text-primary-500">
                  Total Price:
                </p>
                <p className=" font-semibold text-white">$7.8M - $10.1M</p>
              </div>
              <div className="flex items-center  py-0.5 2xl:py-1   justify-between">
                <p className="text-xs 2xl:text-base capitalize  text-primary-500">
                  Expected Impressions /mo:
                </p>
                <p className=" font-semibold 2xl:text-xl text-[#42E34A]">
                  4.6B - 5.9B
                </p>
              </div>
              <div className="flex items-center  py-0.5 2xl:py-1   justify-between">
                <p className="text-xs 2xl:text-base capitalize  text-primary-500">
                  AI Expected Performance
                </p>
                <p className=" font-semibold 2xl:text-xl text-[#42E34A]">89%</p>
              </div>
              <Link href={"/campaign-summary"}>
                <Button className="bg-primary-50 mt-4 flex items-center inner-shadow gap-2 hover:bg-primary-50/70 w-full px-4 2xl:px-6 font-semibold text-xs 2xl:text-sm text-white py-3 2xl:py-4 ">
                  Integrate Now!
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelComponent;
