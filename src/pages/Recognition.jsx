import React, { useEffect, useRef, useState } from "react";
import { Button, Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { ToastContainer, toast } from "react-toastify";
import { BiUser, BiCalendar } from "react-icons/bi";
import apiClient from "../components/apiClient";
import "react-toastify/dist/ReactToastify.css";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { useSpeechSynthesis } from "react-speech-kit";

const Recognition = () => {
  const { currentColor, currentMode } = useStateContext();
  const webcamRef = React.useRef(null);
  const canvasRef = useRef(null);
  const blazeface = require("@tensorflow-models/blazeface");
  const { speak } = useSpeechSynthesis();
  const [userAttendance, setUserAttendance] = useState([]);
  const [userAttendanceTag, setUserAttendanceTag] = useState([]);

  const { API } = apiClient();
  const notifyFail = (message) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const notifySuccess = (message) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const videoConstraints = {
    width: 800,
    height: 800,
    facingMode: "user",
  };

  useEffect(async () => {
    const model = await blazeface.load();

    setInterval(() => {
      detectFace(model);
    }, 3000);
  }, [webcamRef]);

  const returnTensors = false;
  const drawBoxDetection = (predictions, ctx) => {
    if (predictions.length > 0) {
      for (let i = 0; i < predictions.length; i++) {
        const start = predictions[i].topLeft;
        const end = predictions[i].bottomRight;
        const size = [end[0] - start[0], end[1] - start[1]];

        // Render a rectangle over each detected face.

        ctx.beginPath();
        ctx.lineWidth = "6";
        ctx.strokeStyle = "red";
        ctx.rect(start[0], start[1], size[0], size[1]);
        ctx.stroke();
      }
    }
  };

  const detectFace = async (model) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      //Set video height and width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      //Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make detections

      const prediction = await model.estimateFaces(video, returnTensors);

      if (prediction.length > 0) {
        const pictureSrc = webcamRef.current.getScreenshot();

        const payload = {
          image: pictureSrc,
        };

        try {
          const response = await API.post(`/recognition`, payload);
          console.log(response.data.message);
          if (response.data.status == 200) {
            const userInfo = response.data.data[0];

            userAttendance.push(userInfo);

            const attendanceTagList = userAttendance.map((item, key) => (
              <div
                className="grid grid-cols-3 gap-2 bg-slate-100 p-2 rounded-md mt-1"
                key={key}
              >
                <img className="shadow-sm rounded-sm" src={pictureSrc} />
                <div className="col-span-2">
                  <span className="inline-flex gap-1">
                    <BiUser className="text-gray-500" />
                    <b className="text-[13px]">{item.name}</b>
                  </span>
                  <span className="inline-flex gap-1">
                    <BiCalendar className="text-gray-500" />
                    <p className="text-xs text-gray-600">{item.datetime}</p>
                  </span>
                </div>
              </div>
            ));

            setUserAttendanceTag(attendanceTagList);

            notifySuccess(response.data.message);
            speak({ text: response.data.message });
          } else {
            notifyFail(response.data.message);
            speak({ text: response.data.message });
          }
        } catch (error) {
          console.log(error);
          notifyFail("System error");
        }
        const ctx = canvasRef.current.getContext("2d");
        drawBoxDetection(prediction, ctx);
      }
    }
  };
  //   const capture = React.useCallback(() => {
  //     if(pictures.length >= 6 ){
  //       console.log(pictures);
  //       notifyFail("Get image has reached");

  //     }
  //     else{
  //       const pictureSrc = webcamRef.current.getScreenshot()
  //       pictures.push(pictureSrc);

  //       const pictureTagList = pictures.map((item, key) => <img src={item} key={key} />)

  //       setPictureTag(pictureTagList);
  //     }
  //   })

  //   const handleSnapVideo = async(e) => {
  //     e.preventDefault();
  //     const payload = {
  //       name: "nam",
  //       image: pictures,
  //     };

  //     try {
  //       const response = await API.post(`/add`, payload);
  //       console.log(response);
  //     } catch (error) {
  //       console.log(error);
  //       notifyFail("Submit snapshot failed");
  //     }
  //   };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl  ">
      <Header category="Page" title="Trainning" />
      <div className="w-full grid grid-cols-4">
        {/* <video className='scale-x-[-1]' ref={videoRef}></video> */}
        {
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="col-span-3"
          />
        }
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            top: 100,
            left: 0,
            right: 80,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        <div className="overscroll-auto overflow-y-auto max-h-[500px] overflow-x-hidden">
          {userAttendanceTag}
        </div>
      </div>

      <ToastContainer
        className="mt-20"
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ToastContainer
        className="mt-20"
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};
export default Recognition;
