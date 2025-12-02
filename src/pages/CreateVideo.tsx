import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sparkles, Upload, Video, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { addDoc, collection, serverTimestamp, db, runTransaction, doc, storage, storageRef, uploadBytes, getDownloadURL } from "@/lib/firebase";

const CreateVideo = () => {
  const [videoType, setVideoType] = useState<"text-to-video" | "image-to-video">("text-to-video");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [duration, setDuration] = useState("10");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string>("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { toast } = useToast();
  const { user, credits } = useAuth();

  // Map aspect ratio from form to API format
  const mapAspectRatio = (ratio: string): string => {
    const ratioMap: Record<string, string> = {
      "16:9": "landscape",
      "9:16": "portrait",
      "1:1": "square",
      "4:3": "landscape", // Map 4:3 to landscape as API may not support it
    };
    return ratioMap[ratio] || "landscape";
  };

  // Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploadedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Upload image to Firebase Storage
  const handleImageUpload = async () => {
    if (!uploadedImage || !user) return;

    setIsUploadingImage(true);
    try {
      const imageRef = storageRef(storage, `images/${user.uid}/${Date.now()}_${uploadedImage.name}`);
      await uploadBytes(imageRef, uploadedImage);
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
      toast({
        title: "Image uploaded successfully!",
        description: "Your image is ready to use for video generation.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please describe the video you want to create",
        variant: "destructive",
      });
      return;
    }

    if (videoType === "image-to-video" && !imageUrl) {
      toast({
        title: "Image required",
        description: "Please upload and confirm an image first",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to create videos.", variant: "destructive" });
      return;
    }

    if (typeof credits === "number" && credits < 5) {
      toast({ title: "Insufficient credits", description: "You need at least 5 credits to create a video.", variant: "destructive" });
      return;
    }

    const apiKey = import.meta.env.VITE_KIE_AI_API_KEY;
    if (!apiKey || apiKey === "YOUR_API_KEY") {
      toast({
        title: "API Key not configured",
        description: "Please set VITE_KIE_AI_API_KEY in your .env file",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setResultUrl(null);
    setStatusText("Submitting job to Kie AI...");

    try {
      const isImageToVideo = videoType === "image-to-video";
      const requestBody: any = {
        model: isImageToVideo ? "sora-2-image-to-video" : "sora-2-text-to-video",
        callBackUrl: window.location.origin + "/api/callback",
        input: {
          prompt: prompt,
          aspect_ratio: mapAspectRatio(aspectRatio),
          n_frames: duration,
          remove_watermark: true,
        },
      };

      if (isImageToVideo && imageUrl) {
        requestBody.input.image_urls = [imageUrl];
      }

      const response = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Expecting a taskId back
      const returnedTaskId: string | undefined =
        result?.data?.taskId || result?.data?.task_id || result?.taskId || result?.task_id;

      if (!returnedTaskId) {
        throw new Error("Task ID missing from createTask response");
      }

      setTaskId(returnedTaskId);
      setStatusText("Generating... this can take a few minutes.");

      toast({
        title: "Video generation started!",
        description: `Task ID: ${returnedTaskId}`,
      });

      // Begin polling for completion
      await pollForResult(returnedTaskId, apiKey);
    } catch (error) {
      console.error("Error generating video:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to start video generation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const pollForResult = async (id: string, apiKey: string) => {
    const intervalMs = 5000; // Check every 5 seconds
    let attempt = 0;
    const startTime = Date.now();

    return new Promise<void>((resolve, reject) => {
      const intervalId = setInterval(async () => {
        attempt += 1;
        const elapsedMinutes = Math.floor((Date.now() - startTime) / 60000);
        try {
          setStatusText(`Checking status... (${elapsedMinutes > 0 ? `${elapsedMinutes}m ` : ""}attempt ${attempt})`);
          const res = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(id)}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          });

          const json = await res.json().catch(() => ({}));
          const state: string | undefined = json?.data?.state;

          if (state === "success") {
            clearInterval(intervalId);
            setStatusText("Generation complete. Fetching result...");
            // Parse resultJson which is a JSON string
            const resultJsonStr: string | undefined = json?.data?.resultJson;
            let firstUrl: string | null = null;
            if (resultJsonStr) {
              try {
                const parsed = JSON.parse(resultJsonStr);
                const urls: string[] | undefined = parsed?.resultUrls;
                const wmUrls: string[] | undefined = parsed?.resultWaterMarkUrls;
                firstUrl = (urls && urls[0]) || (wmUrls && wmUrls[0]) || null;
              } catch {
                // ignore
              }
            }

            if (!firstUrl) {
              toast({
                title: "No result URL returned",
                description: "The task completed but no URL was provided.",
                variant: "destructive",
              });
              setStatusText("Completed, but no URL returned.");
              resolve();
              return;
            }

            setResultUrl(firstUrl);
            setStatusText("Ready");
            toast({ title: "Video ready!", description: "Preview updated with your result." });

            // Persist video and deduct credits atomically
            try {
              await runTransaction(db as any, async (tx) => {
                const userRef = doc(db, "users", user.uid);
                const snap = await tx.get(userRef);
                const currentCredits = (snap.data() as any)?.credits ?? 0;
                if (currentCredits < 5) {
                  throw new Error("Insufficient credits");
                }
                // Add video doc
                const videosRef = collection(db, "videos");
                tx.set(doc(videosRef), {
                  uid: user.uid,
                  url: firstUrl,
                  prompt,
                  aspectRatio,
                  duration,
                  taskId: id,
                  videoType: videoType,
                  imageUrl: videoType === "image-to-video" ? imageUrl : null,
                  createdAt: serverTimestamp(),
                });
                // Deduct 5 credits
                tx.update(userRef, { credits: (currentCredits - 5) });
              });
              
              // Reset form fields but keep video preview
              setPrompt("");
              setStyle("cinematic");
              setDuration("10");
              setAspectRatio("16:9");
              setTaskId(null);
              // Reset image upload for next video
              if (videoType === "image-to-video") {
                setUploadedImage(null);
                setImagePreview(null);
                setImageUrl(null);
              }
              
              // Show success dialog
              setShowSuccessDialog(true);
            } catch (err) {
              console.error("Failed to store video or deduct credits:", err);
              toast({ title: "Credits error", description: err instanceof Error ? err.message : "Unable to deduct credits.", variant: "destructive" });
            }
            resolve();
            return;
          }

          if (state === "failed" || state === "error") {
            clearInterval(intervalId);
            const failMsg: string | undefined = json?.data?.failMsg;
            setStatusText("Failed");
            toast({ title: "Generation failed", description: failMsg || "Unknown error.", variant: "destructive" });
            reject(new Error(failMsg || "Task failed"));
            return;
          }

          // Continue polling indefinitely - no timeout
          // The interval will keep running until success or failure
        } catch (e) {
          // On network errors, continue polling instead of stopping
          console.error("Error checking status (will retry):", e);
          setStatusText(`Error checking status (retrying... attempt ${attempt})`);
          // Don't clear interval on errors - keep trying
        }
      }, intervalMs);
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Create New Video</h1>
          <p className="text-muted-foreground">Describe your vision and let AI bring it to life</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Type Selector */}
            <Card className="glass-card p-6">
              <label className="text-sm font-medium mb-2 block">Video Type</label>
              <Select value={videoType} onValueChange={(value: "text-to-video" | "image-to-video") => {
                setVideoType(value);
                // Reset image when switching types
                if (value === "text-to-video") {
                  setUploadedImage(null);
                  setImagePreview(null);
                  setImageUrl(null);
                }
              }}>
                <SelectTrigger className="glass-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text-to-video">Text to Video</SelectItem>
                  <SelectItem value="image-to-video">Image to Video (Ad Creation & UGC)</SelectItem>
                </SelectContent>
              </Select>
            </Card>

            <Card className="glass-card p-6">
              <label className="text-sm font-medium mb-2 block">Prompt</label>
              <Textarea
                placeholder={videoType === "image-to-video" 
                  ? "Describe how you want the image to animate. For example: 'A claymation conductor passionately leads a claymation orchestra...'"
                  : "A slow-motion cinematic shot of waves crashing at sunset — warm film tone, 16:9, 10 seconds."}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="glass-card min-h-32 resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {videoType === "image-to-video" 
                  ? "Describe the animation and movement you want for your image"
                  : "Be specific about mood, camera movement, and visual style for best results"}
              </p>
            </Card>

            {/* Image Upload Section - Only for image-to-video */}
            {videoType === "image-to-video" && (
              <Card className="glass-card p-6">
                <label className="text-sm font-medium mb-2 block">Upload Image</label>
                {!imageUrl ? (
                  <>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground mb-1">
                          {uploadedImage ? "Image selected. Click upload to confirm." : "Click to select an image"}
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                      </label>
                    </div>
                    
                    {imagePreview && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Preview:</p>
                        <div className="relative rounded-lg overflow-hidden border border-border">
                          <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-contain" />
                        </div>
                        <Button
                          onClick={handleImageUpload}
                          disabled={isUploadingImage}
                          className="w-full mt-4 glow-primary"
                        >
                          {isUploadingImage ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Confirm Upload
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="border border-border rounded-lg p-4 bg-primary/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded overflow-hidden border border-border">
                          <img src={imageUrl} alt="Uploaded" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Image uploaded successfully</p>
                          <p className="text-xs text-muted-foreground">Ready for video generation</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setImageUrl(null);
                          setImagePreview(null);
                          setUploadedImage(null);
                        }}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card p-6">
                <label className="text-sm font-medium mb-2 block">Style</label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="glass-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cinematic">Cinematic</SelectItem>
                    <SelectItem value="documentary">Documentary</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="cartoon">Cartoon</SelectItem>
                    <SelectItem value="realistic">Realistic</SelectItem>
                  </SelectContent>
                </Select>
              </Card>

              <Card className="glass-card p-6">
                <label className="text-sm font-medium mb-2 block">Duration</label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="glass-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 seconds</SelectItem>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="20">20 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </Card>

              <Card className="glass-card p-6">
                <label className="text-sm font-medium mb-2 block">Aspect Ratio</label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger className="glass-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                    <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    <SelectItem value="4:3">4:3 (Classic)</SelectItem>
                  </SelectContent>
                </Select>
              </Card>
            </div>

            <Button 
              onClick={handleGenerate} 
              size="lg" 
              className="w-full glow-primary"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Video (5 Credits)
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-4">Preview</h3>
              <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                {resultUrl ? (
                  resultUrl.match(/\.(mp4|webm)(\?|$)/i) ? (
                    <video src={resultUrl} className="w-full h-full" controls playsInline />
                  ) : resultUrl.match(/\.(png|jpg|jpeg|gif|webp)(\?|$)/i) ? (
                    <img src={resultUrl} alt="Result" className="w-full h-full object-contain" />
                  ) : (
                    <a href={resultUrl} className="text-primary underline" target="_blank" rel="noreferrer">
                      Open result
                    </a>
                  )
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Video className="w-12 h-12" />}
                    <span className="text-sm">{statusText || "Your video will appear here once generation starts"}</span>
                  </div>
                )}
              </div>
              {taskId && (
                <p className="text-xs text-muted-foreground">Task ID: {taskId}</p>
              )}
            </Card>

            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-4">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Be specific about lighting and mood</li>
                <li>• Mention camera movements for dynamic shots</li>
                <li>• Include color palette preferences</li>
                <li>• Specify the time of day if relevant</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              Video Created Successfully!
            </DialogTitle>
            <DialogDescription>
              Your video has been generated and saved. You can view it in your videos library or create another one.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)} className="glow-primary">
              Continue Creating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CreateVideo;
