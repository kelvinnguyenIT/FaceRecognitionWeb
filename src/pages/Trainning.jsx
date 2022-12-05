import React, { useEffect, useRef, useState } from "react";
import { Button, Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { ToastContainer, toast } from "react-toastify";
import apiClient from "../components/apiClient";
import "react-toastify/dist/ReactToastify.css";
import Webcam from "react-webcam";
import { useSpeechSynthesis } from "react-speech-kit";

const Trainning = () => {
  const { currentColor, currentMode } = useStateContext();
  const [pictures, setPictures] = useState([]);
  const [pictureTag, setPictureTag] = useState([]);
  const webcamRef = React.useRef(null);
  const { API } = apiClient();
  const { speak } = useSpeechSynthesis();

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

  const videoConstraints = {
    width: 600,
    height: 600,
    facingMode: "user",
  };

  const capture = React.useCallback(() => {
    if (pictures.length >= 6) {
      console.log(pictures);
      notifyFail("Get image has reached");
      speak({ text: "Get image has reached" });
    } else {
      const pictureSrc = webcamRef.current.getScreenshot();
      pictures.push(pictureSrc);

      const pictureTagList = pictures.map((item, key) => (
        <img src={item} key={key} />
      ));

      setPictureTag(pictureTagList);
    }
  });

  const handleSnapVideo = async (e) => {
    e.preventDefault();
    const payload = {
      name: "nam",
      image: pictures,
    };

    try {
      const response = await API.post(`/add`, payload);
      console.log(response);
    } catch (error) {
      console.log(error);
      notifyFail("Submit snapshot failed");
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl  ">
      <Header category="Page" title="Trainning" />
      <div className="w-full ">
        <Button
          color="white"
          bgColor={currentColor}
          text="Snapshot"
          margin="5px"
          borderRadius="10px"
          onClickFuntion={capture}
        />
        <Button
          color="white"
          bgColor={currentColor}
          text="Submit"
          margin="5px"
          borderRadius="10px"
          onClickFuntion={handleSnapVideo}
        />
      </div>
      <div className="w-full grid grid-cols-3 gap-5">
        <div className="h-[500px] col-span-2" id="containerVideo">
          {/* <video className='scale-x-[-1]' ref={videoRef}></video> */}
          {
            <Webcam
              audio={false}
              height={600}
              ref={webcamRef}
              width={600}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          }
        </div>
        <div className="w-1/5"></div>
      </div>
      <div className="w-full grid grid-cols-6 gap-3">{pictureTag}</div>

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
    </div>
  );
};
export default Trainning;
