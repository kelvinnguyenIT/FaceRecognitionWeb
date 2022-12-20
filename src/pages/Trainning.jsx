import React, { useEffect, useRef, useState } from "react";
import { Button, Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { ToastContainer, toast } from "react-toastify";
import apiClient from "../components/apiClient";
import "react-toastify/dist/ReactToastify.css";
import Webcam from "react-webcam";
import { useSpeechSynthesis } from "react-speech-kit";
import { useNavigate } from "react-router-dom";

const Trainning = () => {
  const { currentColor, currentMode } = useStateContext();
  const [pictures, setPictures] = useState([]);
  const [pictureTag, setPictureTag] = useState([]);
  const [userCode, setUserCode] = useState("");
  const webcamRef = React.useRef(null);
  const { API } = apiClient();
  const { speak } = useSpeechSynthesis();
  const navigate = useNavigate();

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
    if (
      pictures.length === 6 &&
      userCode !== "" &&
      userCode.length === 7 &&
      userCode.toUpperCase().startsWith("NV")
    ) {
      const payload = {
        code: userCode.toUpperCase(),
        image: pictures,
      };

      try {
        const response = await API.post(`/training`, payload);
        console.log(response.data.message);
        if (response.data.status == 200) {
          notifySuccess(response.data.message);
          speak({ text: response.data.message });
          setPictures([]);
          setPictureTag([]);
          setUserCode("");
        } else {
          notifyFail(response.data.message);
          speak({ text: response.data.message });
        }
      } catch (error) {
        console.log(error);
        notifyFail("Submit snapshot failed");
      }
    } else {
      if (pictures.length < 6) {
        notifyFail("Not enough image snapshot");
      }
      if (userCode === "") {
        notifyFail("Enter user code");
      }
      if (userCode.length !== 7 || !userCode.toUpperCase().startsWith("NV")) {
        notifyFail("User code wrong format");
      }
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl  ">
      <Header category="Page" title="Trainning" />

      <div className="w-full h-fit grid grid-cols-3 gap-5">
        <div className="h-[500px] col-span-2 " id="containerVideo">
          {/* <video className='scale-x-[-1]' ref={videoRef}></video> */}
          {
            <Webcam
              audio={false}
              height={600}
              width={600}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          }
          <div className="absolute top-[67%]">
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
        </div>
        <div className="w-full ">
          <input
            type="text"
            placeholder="Enter code employee. Ex: NV06632"
            className="w-full border rounded-md text-sm p-2 mt-2"
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2 mt-3">{pictureTag}</div>
        </div>
      </div>
      {/* <div className="w-full grid grid-cols-6 gap-3">{pictureTag}</div> */}

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
export default Trainning;
