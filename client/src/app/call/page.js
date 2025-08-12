"use client";
import PageLoader from "@/components/loaders/pageLoader";
import { ZEGO_CONFIG } from "@/config/zegoConfig";
import useSubscriptionCheck from "@/hooks/useSubscriptionCheck";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
const CallPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ZegoUIKitRef = useRef(null);
  const zegoRef = useRef(null);
  const { loading, redirectReason } = useSubscriptionCheck();

  useEffect(() => {
    if (redirectReason) {
      toast(redirectReason, { icon: "ℹ️" });
    }
  }, [redirectReason]);

  const isVideoCall = searchParams.get("isVideoCall") === "true";

  const handleLeaveRoom = () => {
    // Directly navigate to the desired page after leaving the room
    router.replace("/chat");
  };



  useEffect(() => {
    const initializeZegoCloud = async () => {
      if (typeof window === "undefined") return;

      try {
        const module = await import("@zegocloud/zego-uikit-prebuilt");
        ZegoUIKitRef.current = module.ZegoUIKitPrebuilt;

        const roomID = searchParams.get("roomID");
        const userID = searchParams.get("userID");
        const userName = searchParams.get("userName");

        if (!roomID || !userID || !userName) {
          toast.error("Missing call parameters");
          router.push("/chat");
          return;
        }

        const kitToken = ZegoUIKitRef.current.generateKitTokenForTest(
          ZEGO_CONFIG.appID,
          ZEGO_CONFIG.serverSecret,
          roomID,
          userID,
          userName
        );
        const zp = ZegoUIKitRef.current.create(kitToken);
        zegoRef.current = zp;

        await zp.joinRoom({
          container: document.getElementById("zego-call-container"),
          scenario: {
            mode: isVideoCall
              ? ZegoUIKitRef.current.VideoConference
              : ZegoUIKitRef.current.OneONoneCall,
          },
          showPreJoinView: true,
          turnOnCameraWhenJoining: isVideoCall,
          showLeavingView: false,
          // onLeaveRoom: handleLeaveRoom,
        });
      } catch (error) {
        toast.error("Error initializing call:", error);
        router.push("/chat");
      }

    };
    initializeZegoCloud();

    return () => {
      if (zegoRef.current) {
        zegoRef.current.destroy();
      }
    };
  }, [searchParams, router]);

  return (

    <>
      {
        loading ?
          <PageLoader />
          :
          <div className="relative h-screen flex justify-center items-center bg-black">
            <button
              className="absolute top-4 left-4 z-50 btn btn-sm bg-[#0056FC] text-[#FFFFFF] rounded-[10px] font-semibold px-5 py-2 text-[16px]"
              onClick={handleLeaveRoom}

            >
              Go To Chats
            </button>
            <div id="zego-call-container" className="w-full h-full"></div>
          </div>

      }
    </>

  );
};

export default CallPage;
