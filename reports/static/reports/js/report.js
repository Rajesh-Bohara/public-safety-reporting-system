document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const form = document.getElementById("reportForm");

    /* Photo */
    const photoGallery =
        document.getElementById("photoGallery");

    const takePhotoBtn =
        document.getElementById("takePhotoBtn");

    const photoPreview =
        document.getElementById("photoPreview");

    const photoPreviewContainer =
        document.getElementById("photoPreviewContainer");

    const removePhoto =
        document.getElementById("removePhoto");


    /* Video */
    const videoGallery =
        document.getElementById("videoGallery");

    const recordVideoBtn =
        document.getElementById("recordVideoBtn");

    const videoPreview =
        document.getElementById("videoPreview");

    const videoPreviewContainer =
        document.getElementById("videoPreviewContainer");

    const removeVideo =
        document.getElementById("removeVideo");


    /* Audio */
    const audioGallery =
        document.getElementById("audioGallery");

    const recordAudioBtn =
        document.getElementById("recordAudioBtn");

    const audioPreview =
        document.getElementById("audioPreview");

    const audioPreviewContainer =
        document.getElementById("audioPreviewContainer");

    const removeAudio =
        document.getElementById("removeAudio");


    /* Camera */
    const cameraModal =
        document.getElementById("cameraModal");

    const cameraStream =
        document.getElementById("cameraStream");

    const cameraTitle =
        document.getElementById("cameraTitle");

    const cameraSubtitle =
        document.getElementById("cameraSubtitle");

    const cameraAction =
        document.getElementById("cameraAction");

    const closeCamera =
        document.getElementById("closeCamera");

    const cameraMessage =
        document.getElementById("cameraMessage");

    const recordingIndicator =
        document.getElementById("recordingIndicator");


    /* Audio modal */
    const audioModal =
        document.getElementById("audioModal");

    const audioAction =
        document.getElementById("audioAction");

    const closeAudio =
        document.getElementById("closeAudio");

    const audioMessage =
        document.getElementById("audioMessage");

    const recordTime =
        document.getElementById("recordTime");

    const audioRecordingStatus =
        document.getElementById("audioRecordingStatus");


    /* =====================================================
       VARIABLES
    ===================================================== */

    let currentStream = null;

    let cameraMode = null;

    let mediaRecorder = null;

    let recordedChunks = [];

    let audioRecorder = null;

    let audioRecorderStream = null;

    let audioChunks = [];

    let audioTimer = null;

    let audioSeconds = 0;


    /* =====================================================
       CURRENT DATE & TIME
       Nepal Time - Asia/Kathmandu
    ===================================================== */

    function setCurrentDateTime() {

        const datetime =
            document.getElementById("datetime");

        if (!datetime) {
            return;
        }

        const now = new Date();

        const nepalTime =
            new Date(
                now.toLocaleString(
                    "en-US",
                    {
                        timeZone: "Asia/Kathmandu"
                    }
                )
            );


        const year =
            nepalTime.getFullYear();

        const month =
            String(
                nepalTime.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                nepalTime.getDate()
            ).padStart(2, "0");

        const hours =
            String(
                nepalTime.getHours()
            ).padStart(2, "0");

        const minutes =
            String(
                nepalTime.getMinutes()
            ).padStart(2, "0");


        datetime.value =
            `${year}-${month}-${day}T${hours}:${minutes}`;
    }


    setCurrentDateTime();


    /* =====================================================
       LOCATION + REVERSE GEOCODING
    ===================================================== */

    function getLocation() {

        const locationInput =
            document.getElementById("location");

        const latitude =
            document.getElementById("latitude");

        const longitude =
            document.getElementById("longitude");


        if (
            !locationInput ||
            !latitude ||
            !longitude
        ) {
            return;
        }


        /* Browser does not support Geolocation */

        if (!navigator.geolocation) {

            locationInput.value =
                "Location is not supported by this browser.";

            return;
        }


        locationInput.value =
            "Detecting your location...";


        navigator.geolocation.getCurrentPosition(

            async function (position) {

                const lat =
                    position.coords.latitude;

                const lng =
                    position.coords.longitude;


                /* Store coordinates */

                latitude.value =
                    lat.toFixed(6);

                longitude.value =
                    lng.toFixed(6);


                /* Temporary message */

                locationInput.value =
                    "Finding place name...";


                /* Reverse Geocoding */

                try {

                    const placeName =
                        await reverseGeocode(
                            lat,
                            lng
                        );


                    if (placeName) {

                        locationInput.value =
                            placeName;

                    } else {

                        locationInput.value =
                            `Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`;
                    }


                } catch (error) {

                    console.error(
                        "Reverse geocoding error:",
                        error
                    );


                    /* Fallback to coordinates */

                    locationInput.value =
                        `Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`;
                }

            },


            function (error) {

                console.error(
                    "Location error:",
                    error
                );


                if (error.code === 1) {

                    locationInput.value =
                        "Location permission denied.";

                } else if (error.code === 2) {

                    locationInput.value =
                        "Location unavailable.";

                } else if (error.code === 3) {

                    locationInput.value =
                        "Location request timed out.";

                } else {

                    locationInput.value =
                        "Unable to detect location.";
                }
            },


            {
                enableHighAccuracy: true,

                timeout: 15000,

                maximumAge: 0
            }
        );
    }


    /* =====================================================
       REVERSE GEOCODING
       OpenStreetMap Nominatim
    ===================================================== */

    async function reverseGeocode(
        latitude,
        longitude
    ) {

        /*
         * Correct Nominatim reverse-geocoding URL.
         *
         * The previous version had Markdown-style
         * link syntax inside the JavaScript URL.
         *
         * Here we use the actual URL directly.
         */

        const url =
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&zoom=18&addressdetails=1&accept-language=en`;


        const response =
            await fetch(
                url,
                {
                    method: "GET",

                    headers: {
                        "Accept": "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `Reverse geocoding failed: ${response.status}`
            );
        }


        const data =
            await response.json();


        if (!data) {
            return null;
        }


        /*
         * Nominatim provides a complete human-readable
         * address in display_name.
         *
         * Example:
         *
         * Amala Bisaune, Pokhara-16, Pokhara, Kaski,
         * Gandaki Province, 60600, Nepal
         */

        if (
            data.display_name &&
            data.display_name.trim() !== ""
        ) {

            return data.display_name.trim();
        }


        return null;
    }


    /* Start location detection */

    getLocation();


    /* =====================================================
       FILE INPUT HELPER
    ===================================================== */

    function putFileIntoInput(
        file,
        input
    ) {

        const dataTransfer =
            new DataTransfer();

        dataTransfer.items.add(file);

        input.files =
            dataTransfer.files;
    }


    /* =====================================================
       PHOTO GALLERY
    ===================================================== */

    photoGallery.addEventListener(
        "change",
        function () {

            if (!this.files.length) {
                return;
            }

            const file =
                this.files[0];

            showPhoto(file);
        }
    );


    function showPhoto(file) {

        if (!file.type.startsWith("image/")) {

            alert(
                "Please select a valid image."
            );

            return;
        }


        const url =
            URL.createObjectURL(file);

        photoPreview.src =
            url;

        photoPreviewContainer.hidden =
            false;
    }


    /* =====================================================
       OPEN PHOTO CAMERA
    ===================================================== */

    takePhotoBtn.addEventListener(
        "click",
        function () {

            cameraMode =
                "photo";

            openCamera(
                "Take Picture",
                "Position the camera and capture the photo."
            );
        }
    );


    /* =====================================================
       OPEN VIDEO CAMERA
    ===================================================== */

    recordVideoBtn.addEventListener(
        "click",
        function () {

            cameraMode =
                "video";

            openCamera(
                "Record Video",
                "Press start to begin recording."
            );
        }
    );


    /* =====================================================
       OPEN CAMERA
    ===================================================== */

    async function openCamera(
        title,
        subtitle
    ) {

        cameraTitle.textContent =
            title;

        cameraSubtitle.textContent =
            subtitle;

        cameraMessage.textContent =
            "";

        recordingIndicator.hidden =
            true;

        cameraModal.hidden =
            false;

        cameraAction.disabled =
            false;


        try {

            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {

                throw new Error(
                    "Camera API is not supported by this browser."
                );
            }


            currentStream =
                await navigator.mediaDevices.getUserMedia({

                    video: {
                        facingMode: {
                            ideal: "environment"
                        }
                    },

                    audio:
                        cameraMode === "video"
                });


            cameraStream.srcObject =
                currentStream;


            if (
                cameraMode ===
                "photo"
            ) {

                cameraAction.innerHTML =
                    `<i class="fa-solid fa-camera"></i>
                     <span>Capture Photo</span>`;

            } else {

                cameraAction.innerHTML =
                    `<i class="fa-solid fa-circle"></i>
                     <span>Start Recording</span>`;
            }


        } catch (error) {

            console.error(error);

            cameraMessage.textContent =
                "Camera access was blocked or unavailable. Please allow camera permission and try again.";

            cameraAction.disabled =
                true;
        }
    }


    /* =====================================================
       CAMERA ACTION
    ===================================================== */

    cameraAction.addEventListener(
        "click",
        function () {

            if (
                cameraMode ===
                "photo"
            ) {

                capturePhoto();

            } else if (
                cameraMode ===
                "video"
            ) {

                if (
                    !mediaRecorder ||
                    mediaRecorder.state ===
                    "inactive"
                ) {

                    startVideoRecording();

                } else {

                    stopVideoRecording();
                }
            }
        }
    );


    /* =====================================================
       CAPTURE PHOTO
    ===================================================== */

    function capturePhoto() {

        if (!currentStream) {
            return;
        }


        const canvas =
            document.createElement(
                "canvas"
            );


        const width =
            cameraStream.videoWidth;

        const height =
            cameraStream.videoHeight;


        canvas.width =
            width;

        canvas.height =
            height;


        const context =
            canvas.getContext(
                "2d"
            );


        context.drawImage(
            cameraStream,
            0,
            0,
            width,
            height
        );


        canvas.toBlob(
            function (blob) {

                if (!blob) {
                    return;
                }


                const file =
                    new File(
                        [blob],
                        `incident_photo_${Date.now()}.jpg`,
                        {
                            type:
                                "image/jpeg"
                        }
                    );


                putFileIntoInput(
                    file,
                    photoGallery
                );


                showPhoto(file);

                closeCameraModal();
            },

            "image/jpeg",

            0.9
        );
    }


    /* =====================================================
       START VIDEO RECORDING
    ===================================================== */

    function startVideoRecording() {

        recordedChunks = [];


        let options = {};


        if (
            MediaRecorder.isTypeSupported(
                "video/webm;codecs=vp9"
            )
        ) {

            options.mimeType =
                "video/webm;codecs=vp9";

        } else if (
            MediaRecorder.isTypeSupported(
                "video/webm"
            )
        ) {

            options.mimeType =
                "video/webm";

        } else {

            options = {};
        }


        try {

            mediaRecorder =
                new MediaRecorder(
                    currentStream,
                    options
                );

        } catch (error) {

            console.error(error);

            cameraMessage.textContent =
                "Video recording is not supported by this browser.";

            return;
        }


        mediaRecorder.ondataavailable =
            function (event) {

                if (
                    event.data.size >
                    0
                ) {

                    recordedChunks.push(
                        event.data
                    );
                }
            };


        mediaRecorder.onstop =
            function () {

                const blob =
                    new Blob(
                        recordedChunks,
                        {
                            type:
                                mediaRecorder.mimeType ||
                                "video/webm"
                        }
                    );


                const extension =
                    blob.type.includes("mp4")
                        ? "mp4"
                        : "webm";


                const file =
                    new File(
                        [blob],
                        `incident_video_${Date.now()}.${extension}`,
                        {
                            type:
                                blob.type
                        }
                    );


                putFileIntoInput(
                    file,
                    videoGallery
                );


                showVideo(file);

                closeCameraModal();
            };


        mediaRecorder.start();


        recordingIndicator.hidden =
            false;


        cameraAction.innerHTML =
            `<i class="fa-solid fa-stop"></i>
             <span>Stop Recording</span>`;
    }


    /* =====================================================
       STOP VIDEO
    ===================================================== */

    function stopVideoRecording() {

        if (!mediaRecorder) {
            return;
        }


        if (
            mediaRecorder.state !==
            "inactive"
        ) {

            mediaRecorder.stop();
        }


        recordingIndicator.hidden =
            true;
    }


    /* =====================================================
       SHOW VIDEO
    ===================================================== */

    function showVideo(file) {

        const url =
            URL.createObjectURL(
                file
            );

        videoPreview.src =
            url;

        videoPreviewContainer.hidden =
            false;
    }


    /* =====================================================
       VIDEO GALLERY
    ===================================================== */

    videoGallery.addEventListener(
        "change",
        function () {

            if (!this.files.length) {
                return;
            }

            showVideo(
                this.files[0]
            );
        }
    );


    /* =====================================================
       CLOSE CAMERA
    ===================================================== */

    closeCamera.addEventListener(
        "click",
        closeCameraModal
    );


    function closeCameraModal() {

        if (
            mediaRecorder &&
            mediaRecorder.state !==
            "inactive"
        ) {

            mediaRecorder.stop();
        }


        stopCameraStream();


        cameraModal.hidden =
            true;


        cameraStream.srcObject =
            null;


        cameraMode =
            null;


        cameraAction.disabled =
            false;
    }


    /* =====================================================
       STOP CAMERA STREAM
    ===================================================== */

    function stopCameraStream() {

        if (!currentStream) {
            return;
        }


        currentStream
            .getTracks()
            .forEach(
                function (track) {

                    track.stop();
                }
            );


        currentStream =
            null;
    }


    /* =====================================================
       REMOVE PHOTO
    ===================================================== */

    removePhoto.addEventListener(
        "click",
        function () {

            photoGallery.value =
                "";

            photoPreview.src =
                "";

            photoPreviewContainer.hidden =
                true;
        }
    );


    /* =====================================================
       REMOVE VIDEO
    ===================================================== */

    removeVideo.addEventListener(
        "click",
        function () {

            videoGallery.value =
                "";

            videoPreview.pause();

            videoPreview.src =
                "";

            videoPreviewContainer.hidden =
                true;
        }
    );


    /* =====================================================
       AUDIO GALLERY
    ===================================================== */

    audioGallery.addEventListener(
        "change",
        function () {

            if (!this.files.length) {
                return;
            }

            showAudio(
                this.files[0]
            );
        }
    );


    function showAudio(file) {

        const url =
            URL.createObjectURL(
                file
            );

        audioPreview.src =
            url;

        audioPreviewContainer.hidden =
            false;
    }


    /* =====================================================
       OPEN AUDIO RECORDER
    ===================================================== */

    recordAudioBtn.addEventListener(
        "click",
        async function () {

            audioModal.hidden =
                false;

            audioMessage.textContent =
                "";

            resetAudioRecorderUI();


            try {

                if (
                    !navigator.mediaDevices ||
                    !navigator.mediaDevices.getUserMedia
                ) {

                    throw new Error(
                        "Audio recording is not supported."
                    );
                }


                const stream =
                    await navigator.mediaDevices.getUserMedia({
                        audio: true
                    });


                audioRecorderStream =
                    stream;


                audioChunks = [];


                let options = {};


                if (
                    MediaRecorder.isTypeSupported(
                        "audio/webm"
                    )
                ) {

                    options.mimeType =
                        "audio/webm";
                }


                audioRecorder =
                    new MediaRecorder(
                        stream,
                        options
                    );


                audioRecorder.ondataavailable =
                    function (event) {

                        if (
                            event.data.size >
                            0
                        ) {

                            audioChunks.push(
                                event.data
                            );
                        }
                    };


                audioRecorder.onstop =
                    function () {

                        const blob =
                            new Blob(
                                audioChunks,
                                {
                                    type:
                                        audioRecorder.mimeType ||
                                        "audio/webm"
                                }
                            );


                        const file =
                            new File(
                                [blob],
                                `incident_audio_${Date.now()}.webm`,
                                {
                                    type:
                                        blob.type
                                }
                            );


                        putFileIntoInput(
                            file,
                            audioGallery
                        );


                        showAudio(file);

                        stopAudioStream();

                        audioModal.hidden =
                            true;
                    };


            } catch (error) {

                console.error(error);

                audioMessage.textContent =
                    "Microphone access was blocked or unavailable. Please allow microphone permission.";
            }

        }
    );


    /* =====================================================
       AUDIO STREAM
    ===================================================== */

    function stopAudioStream() {

        if (!audioRecorderStream) {
            return;
        }


        audioRecorderStream
            .getTracks()
            .forEach(
                function (track) {

                    track.stop();
                }
            );


        audioRecorderStream =
            null;
    }


    /* =====================================================
       AUDIO ACTION
    ===================================================== */

    audioAction.addEventListener(
        "click",
        function () {

            if (!audioRecorder) {
                return;
            }


            if (
                audioRecorder.state ===
                "inactive"
            ) {

                startAudioRecording();

            } else {

                stopAudioRecording();
            }
        }
    );


    /* =====================================================
       START AUDIO
    ===================================================== */

    function startAudioRecording() {

        audioRecorder.start();


        audioSeconds =
            0;

        updateAudioTime();


        audioTimer =
            setInterval(
                function () {

                    audioSeconds++;

                    updateAudioTime();

                },
                1000
            );


        audioRecordingStatus.textContent =
            "Recording...";


        audioAction.innerHTML =
            `<i class="fa-solid fa-stop"></i>
             <span>Stop Recording</span>`;
    }


    /* =====================================================
       STOP AUDIO
    ===================================================== */

    function stopAudioRecording() {

        if (
            audioRecorder.state !==
            "inactive"
        ) {

            audioRecorder.stop();
        }


        clearInterval(
            audioTimer
        );


        audioRecordingStatus.textContent =
            "Processing recording...";


        audioAction.innerHTML =
            `<i class="fa-solid fa-check"></i>
             <span>Saving...</span>`;
    }


    /* =====================================================
       AUDIO TIME
    ===================================================== */

    function updateAudioTime() {

        const minutes =
            Math.floor(
                audioSeconds / 60
            );


        const seconds =
            audioSeconds % 60;


        recordTime.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }


    /* =====================================================
       RESET AUDIO UI
    ===================================================== */

    function resetAudioRecorderUI() {

        recordTime.textContent =
            "00:00";


        audioRecordingStatus.textContent =
            "Ready to record";


        audioAction.innerHTML =
            `<i class="fa-solid fa-microphone"></i>
             <span>Start Recording</span>`;


        audioMessage.textContent =
            "";


        audioSeconds =
            0;


        clearInterval(
            audioTimer
        );
    }


    /* =====================================================
       CLOSE AUDIO
    ===================================================== */

    closeAudio.addEventListener(
        "click",
        function () {

            if (
                audioRecorder &&
                audioRecorder.state !==
                "inactive"
            ) {

                audioRecorder.stop();
            }


            clearInterval(
                audioTimer
            );


            stopAudioStream();


            audioModal.hidden =
                true;
        }
    );


    /* =====================================================
       REMOVE AUDIO
    ===================================================== */

    removeAudio.addEventListener(
        "click",
        function () {

            audioGallery.value =
                "";

            audioPreview.pause();

            audioPreview.src =
                "";

            audioPreviewContainer.hidden =
                true;
        }
    );


    /* =====================================================
       RESET FORM
    ===================================================== */

    form.addEventListener(
        "reset",
        function () {

            setTimeout(
                function () {

                    photoPreview.src =
                        "";

                    videoPreview.pause();

                    videoPreview.src =
                        "";

                    audioPreview.pause();

                    audioPreview.src =
                        "";


                    photoPreviewContainer.hidden =
                        true;

                    videoPreviewContainer.hidden =
                        true;

                    audioPreviewContainer.hidden =
                        true;


                    /* Reset Nepal date/time */

                    setCurrentDateTime();


                    /*
                     * Detect GPS again and perform
                     * reverse geocoding again.
                     */

                    getLocation();

                },
                50
            );
        }
    );


    /* =====================================================
       CLEAN UP WHEN LEAVING PAGE
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        function () {

            stopCameraStream();

            stopAudioStream();

        }
    );

});