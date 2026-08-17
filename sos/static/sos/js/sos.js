document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       FORM
    ===================================================== */

    const form = document.getElementById("sosForm");
    const sosButton = document.getElementById("sosButton");


    /* =====================================================
       DATE & TIME
       Nepal Time - Asia/Kathmandu
    ===================================================== */

    const datetimeInput =
        document.getElementById("datetime");


    function setCurrentDateTime() {

        if (!datetimeInput) {
            return;
        }

        const now = new Date();

        const nepalTime = new Date(
            now.toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu"
            })
        );

        const year =
            nepalTime.getFullYear();

        const month =
            String(nepalTime.getMonth() + 1)
                .padStart(2, "0");

        const day =
            String(nepalTime.getDate())
                .padStart(2, "0");

        const hours =
            String(nepalTime.getHours())
                .padStart(2, "0");

        const minutes =
            String(nepalTime.getMinutes())
                .padStart(2, "0");

        const seconds =
            String(nepalTime.getSeconds())
                .padStart(2, "0");

        datetimeInput.value =
            `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }


    setCurrentDateTime();

    setInterval(
        setCurrentDateTime,
        1000
    );


    /* =====================================================
       LOCATION
       GPS + REVERSE GEOCODING
    ===================================================== */

    const locationInput =
        document.getElementById("location");

    const latitudeInput =
        document.getElementById("latitude");

    const longitudeInput =
        document.getElementById("longitude");

    const latitudeDisplay =
        document.getElementById("latitudeDisplay");

    const longitudeDisplay =
        document.getElementById("longitudeDisplay");


    async function reverseGeocode(
        latitude,
        longitude
    ) {

        const url =
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&zoom=18&addressdetails=1`;

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


        const address =
            data.address || {};

        const parts = [];


        if (address.road) {
            parts.push(address.road);
        }

        if (address.neighbourhood) {
            parts.push(address.neighbourhood);
        }

        if (address.suburb) {
            parts.push(address.suburb);
        }

        if (address.village) {
            parts.push(address.village);
        }

        if (address.town) {
            parts.push(address.town);
        }

        if (address.city) {
            parts.push(address.city);
        }

        if (address.municipality) {
            parts.push(address.municipality);
        }

        if (address.county) {
            parts.push(address.county);
        }

        if (address.state) {
            parts.push(address.state);
        }

        if (address.country) {
            parts.push(address.country);
        }


        const uniqueParts =
            [...new Set(parts)];


        if (uniqueParts.length > 0) {

            return uniqueParts.join(", ");
        }


        if (data.display_name) {

            return data.display_name;
        }


        return null;
    }


    function getLocation() {

        if (
            !locationInput ||
            !latitudeInput ||
            !longitudeInput
        ) {
            return;
        }


        if (!navigator.geolocation) {

            locationInput.value =
                "Location is not supported by this browser.";

            return;
        }


        locationInput.value =
            "Detecting your location...";


        navigator.geolocation.getCurrentPosition(

            async function (position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                /* Store coordinates */

                latitudeInput.value =
                    latitude;

                longitudeInput.value =
                    longitude;


                /* Display coordinates */

                if (latitudeDisplay) {

                    latitudeDisplay.value =
                        latitude.toFixed(6);
                }


                if (longitudeDisplay) {

                    longitudeDisplay.value =
                        longitude.toFixed(6);
                }


                /* Reverse geocoding */

                locationInput.value =
                    "Finding place name...";


                try {

                    const placeName =
                        await reverseGeocode(
                            latitude,
                            longitude
                        );


                    if (placeName) {

                        locationInput.value =
                            placeName;

                    } else {

                        locationInput.value =
                            `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`;
                    }

                }

                catch (error) {

                    console.error(
                        "Reverse geocoding error:",
                        error
                    );


                    locationInput.value =
                        `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`;
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

                }

                else if (error.code === 2) {

                    locationInput.value =
                        "Location unavailable.";

                }

                else if (error.code === 3) {

                    locationInput.value =
                        "Location request timed out.";

                }

                else {

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


    /* Start location detection */

    getLocation();


    /* =====================================================
       FILE INPUTS
    ===================================================== */

    const photoDevice =
        document.getElementById("photoDevice");

    const videoDevice =
        document.getElementById("videoDevice");

    const audioDevice =
        document.getElementById("audioDevice");


    /* =====================================================
       FILE HELPER
    ===================================================== */

    function putFileIntoInput(
        file,
        input
    ) {

        if (!file || !input) {
            return;
        }


        try {

            const dataTransfer =
                new DataTransfer();

            dataTransfer.items.add(file);

            input.files =
                dataTransfer.files;

        }

        catch (error) {

            console.error(
                "Unable to attach file:",
                error
            );
        }
    }


    /* =====================================================
       PHOTO PREVIEW
    ===================================================== */

    const photoPreview =
        document.getElementById("photoPreview");

    const photoPreviewContainer =
        document.getElementById(
            "photoPreviewContainer"
        );

    const removePhoto =
        document.getElementById("removePhoto");


    function showPhoto(file) {

        if (!file) {
            return;
        }


        if (!file.type.startsWith("image/")) {

            alert(
                "Please select a valid image."
            );

            if (photoDevice) {
                photoDevice.value = "";
            }

            return;
        }


        if (photoPreview.src) {

            URL.revokeObjectURL(
                photoPreview.src
            );
        }


        photoPreview.src =
            URL.createObjectURL(file);

        photoPreviewContainer.hidden =
            false;
    }


    if (photoDevice) {

        photoDevice.addEventListener(
            "change",
            function () {

                if (!this.files.length) {
                    return;
                }

                showPhoto(
                    this.files[0]
                );
            }
        );
    }


    if (removePhoto) {

        removePhoto.addEventListener(
            "click",
            function () {

                if (photoDevice) {
                    photoDevice.value = "";
                }

                photoPreview.src = "";

                photoPreviewContainer.hidden =
                    true;
            }
        );
    }


    /* =====================================================
       VIDEO PREVIEW
    ===================================================== */

    const videoPreview =
        document.getElementById("videoPreview");

    const videoPreviewContainer =
        document.getElementById(
            "videoPreviewContainer"
        );

    const removeVideo =
        document.getElementById("removeVideo");


    function showVideo(file) {

        if (!file) {
            return;
        }


        if (!file.type.startsWith("video/")) {

            alert(
                "Please select a valid video."
            );

            if (videoDevice) {
                videoDevice.value = "";
            }

            return;
        }


        videoPreview.src =
            URL.createObjectURL(file);

        videoPreviewContainer.hidden =
            false;

        videoPreview.load();
    }


    if (videoDevice) {

        videoDevice.addEventListener(
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
    }


    if (removeVideo) {

        removeVideo.addEventListener(
            "click",
            function () {

                if (videoDevice) {
                    videoDevice.value = "";
                }

                videoPreview.pause();

                videoPreview.src = "";

                videoPreviewContainer.hidden =
                    true;
            }
        );
    }


    /* =====================================================
       AUDIO PREVIEW
    ===================================================== */

    const audioPreview =
        document.getElementById("audioPreview");

    const audioPreviewContainer =
        document.getElementById(
            "audioPreviewContainer"
        );

    const removeAudio =
        document.getElementById("removeAudio");


    function showAudio(file) {

        if (!file) {
            return;
        }


        if (!file.type.startsWith("audio/")) {

            alert(
                "Please select a valid audio file."
            );

            if (audioDevice) {
                audioDevice.value = "";
            }

            return;
        }


        audioPreview.src =
            URL.createObjectURL(file);

        audioPreviewContainer.hidden =
            false;

        audioPreview.load();
    }


    if (audioDevice) {

        audioDevice.addEventListener(
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
    }


    if (removeAudio) {

        removeAudio.addEventListener(
            "click",
            function () {

                if (audioDevice) {
                    audioDevice.value = "";
                }

                audioPreview.pause();

                audioPreview.src = "";

                audioPreviewContainer.hidden =
                    true;
            }
        );
    }


    /* =====================================================
       PHOTO CAMERA
    ===================================================== */

    const takePhotoBtn =
        document.getElementById(
            "takePhotoBtn"
        );

    const cameraModal =
        document.getElementById(
            "cameraModal"
        );

    const cameraStream =
        document.getElementById(
            "cameraStream"
        );

    const cameraAction =
        document.getElementById(
            "cameraAction"
        );

    const closeCamera =
        document.getElementById(
            "closeCamera"
        );

    const cameraMessage =
        document.getElementById(
            "cameraMessage"
        );


    let cameraMediaStream = null;


    /* =====================================================
       OPEN PHOTO CAMERA
    ===================================================== */

    if (takePhotoBtn) {

        takePhotoBtn.addEventListener(
            "click",
            async function () {

                cameraModal.hidden =
                    false;

                cameraMessage.textContent =
                    "";


                try {

                    if (
                        !navigator.mediaDevices ||
                        !navigator.mediaDevices.getUserMedia
                    ) {

                        throw new Error(
                            "Camera API is not supported."
                        );
                    }


                    cameraMediaStream =
                        await navigator.mediaDevices.getUserMedia({

                            video: {
                                facingMode: {
                                    ideal: "environment"
                                }
                            },

                            audio: false

                        });


                    cameraStream.srcObject =
                        cameraMediaStream;


                    await cameraStream.play();

                }

                catch (error) {

                    console.error(
                        "Camera error:",
                        error
                    );


                    cameraMessage.textContent =
                        "Camera access was blocked or unavailable. Please allow camera permission and try again.";
                }

            }
        );
    }


    /* =====================================================
       CAPTURE PHOTO
    ===================================================== */

    if (cameraAction) {

        cameraAction.addEventListener(
            "click",
            function () {

                if (!cameraMediaStream) {

                    cameraMessage.textContent =
                        "Camera is not ready yet.";

                    return;
                }


                const width =
                    cameraStream.videoWidth;

                const height =
                    cameraStream.videoHeight;


                if (!width || !height) {

                    cameraMessage.textContent =
                        "Please wait for the camera to load.";

                    return;
                }


                const canvas =
                    document.createElement(
                        "canvas"
                    );


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

                            cameraMessage.textContent =
                                "Unable to capture photo.";

                            return;
                        }


                        const file =
                            new File(
                                [blob],
                                `sos_photo_${Date.now()}.jpg`,
                                {
                                    type: "image/jpeg"
                                }
                            );


                        putFileIntoInput(
                            file,
                            photoDevice
                        );


                        showPhoto(file);


                        closeCameraModal();

                    },

                    "image/jpeg",

                    0.9
                );

            }
        );
    }


    /* =====================================================
       CLOSE PHOTO CAMERA
    ===================================================== */

    if (closeCamera) {

        closeCamera.addEventListener(
            "click",
            closeCameraModal
        );
    }


    function closeCameraModal() {

        if (cameraMediaStream) {

            cameraMediaStream
                .getTracks()
                .forEach(
                    function (track) {

                        track.stop();
                    }
                );
        }


        cameraMediaStream =
            null;


        if (cameraStream) {

            cameraStream.srcObject =
                null;
        }


        if (cameraModal) {

            cameraModal.hidden =
                true;
        }
    }


    /* =====================================================
       VIDEO RECORDING
    ===================================================== */

    const recordVideoBtn =
        document.getElementById(
            "recordVideoBtn"
        );

    const videoModal =
        document.getElementById(
            "videoModal"
        );

    const videoStream =
        document.getElementById(
            "videoStream"
        );

    const videoAction =
        document.getElementById(
            "videoAction"
        );

    const closeVideo =
        document.getElementById(
            "closeVideo"
        );

    const videoMessage =
        document.getElementById(
            "videoMessage"
        );

    const videoRecordingIndicator =
        document.getElementById(
            "videoRecordingIndicator"
        );


    let videoMediaStream = null;

    let mediaRecorder = null;

    let recordedChunks = [];

    let isRecordingVideo = false;


    /* =====================================================
       OPEN VIDEO CAMERA
    ===================================================== */

    if (recordVideoBtn) {

        recordVideoBtn.addEventListener(
            "click",
            async function () {

                videoModal.hidden =
                    false;

                videoMessage.textContent =
                    "";


                try {

                    if (
                        !navigator.mediaDevices ||
                        !navigator.mediaDevices.getUserMedia
                    ) {

                        throw new Error(
                            "Camera API is not supported."
                        );
                    }


                    videoMediaStream =
                        await navigator.mediaDevices.getUserMedia({

                            video: {
                                facingMode: {
                                    ideal: "environment"
                                }
                            },

                            audio: true

                        });


                    videoStream.srcObject =
                        videoMediaStream;


                    await videoStream.play();

                }

                catch (error) {

                    console.error(
                        "Video camera error:",
                        error
                    );


                    videoMessage.textContent =
                        "Camera and microphone access was blocked or unavailable. Please allow permission and try again.";
                }

            }
        );
    }


    /* =====================================================
       VIDEO RECORD BUTTON
    ===================================================== */

    if (videoAction) {

        videoAction.addEventListener(
            "click",
            function () {

                if (!videoMediaStream) {

                    videoMessage.textContent =
                        "Camera is not ready.";

                    return;
                }


                if (!isRecordingVideo) {

                    startVideoRecording();

                }

                else {

                    stopVideoRecording();
                }

            }
        );
    }


    /* =====================================================
       START VIDEO RECORDING
    ===================================================== */

    function startVideoRecording() {

        recordedChunks = [];


        if (
            typeof MediaRecorder ===
            "undefined"
        ) {

            videoMessage.textContent =
                "Video recording is not supported by this browser.";

            return;
        }


        let mimeType = "";


        if (
            MediaRecorder.isTypeSupported(
                "video/webm;codecs=vp9,opus"
            )
        ) {

            mimeType =
                "video/webm;codecs=vp9,opus";

        }

        else if (
            MediaRecorder.isTypeSupported(
                "video/webm;codecs=vp8,opus"
            )
        ) {

            mimeType =
                "video/webm;codecs=vp8,opus";

        }

        else if (
            MediaRecorder.isTypeSupported(
                "video/webm"
            )
        ) {

            mimeType =
                "video/webm";
        }


        try {

            mediaRecorder =
                mimeType
                    ? new MediaRecorder(
                        videoMediaStream,
                        {
                            mimeType: mimeType
                        }
                    )
                    : new MediaRecorder(
                        videoMediaStream
                    );

        }

        catch (error) {

            console.error(
                "MediaRecorder error:",
                error
            );


            videoMessage.textContent =
                "Unable to start video recording.";

            return;
        }


        mediaRecorder.ondataavailable =
            function (event) {

                if (
                    event.data &&
                    event.data.size > 0
                ) {

                    recordedChunks.push(
                        event.data
                    );
                }
            };


        mediaRecorder.onerror =
            function (event) {

                console.error(
                    "Video recorder error:",
                    event
                );

                videoMessage.textContent =
                    "An error occurred while recording.";
            };


        mediaRecorder.onstop =
            function () {

                if (!recordedChunks.length) {

                    videoMessage.textContent =
                        "No video was recorded.";

                    closeVideoModal();

                    return;
                }


                const recordingType =
                    mediaRecorder.mimeType ||
                    "video/webm";


                const blob =
                    new Blob(
                        recordedChunks,
                        {
                            type: recordingType
                        }
                    );


                const file =
                    new File(
                        [blob],
                        `sos_video_${Date.now()}.webm`,
                        {
                            type: recordingType
                        }
                    );


                putFileIntoInput(
                    file,
                    videoDevice
                );


                showVideo(file);


                closeVideoModal();

            };


        mediaRecorder.start(
            1000
        );


        isRecordingVideo =
            true;


        videoAction.innerHTML = `
            <i class="fa-solid fa-stop"></i>
            Stop Recording
        `;


        videoRecordingIndicator.hidden =
            false;
    }


    /* =====================================================
       STOP VIDEO RECORDING
    ===================================================== */

    function stopVideoRecording() {

        if (
            mediaRecorder &&
            mediaRecorder.state !==
            "inactive"
        ) {

            mediaRecorder.stop();
        }


        isRecordingVideo =
            false;


        if (videoRecordingIndicator) {

            videoRecordingIndicator.hidden =
                true;
        }
    }


    /* =====================================================
       CLOSE VIDEO MODAL
    ===================================================== */

    if (closeVideo) {

        closeVideo.addEventListener(
            "click",
            function () {

                if (isRecordingVideo) {

                    stopVideoRecording();

                    /*
                     * Give MediaRecorder time to
                     * finish before closing stream.
                     */
                    setTimeout(
                        closeVideoModal,
                        100
                    );

                }

                else {

                    closeVideoModal();
                }

            }
        );
    }


    function closeVideoModal() {

        if (videoMediaStream) {

            videoMediaStream
                .getTracks()
                .forEach(
                    function (track) {

                        track.stop();
                    }
                );
        }


        videoMediaStream =
            null;


        if (videoStream) {

            videoStream.srcObject =
                null;
        }


        isRecordingVideo =
            false;


        if (videoRecordingIndicator) {

            videoRecordingIndicator.hidden =
                true;
        }


        if (videoAction) {

            videoAction.innerHTML = `
                <i class="fa-solid fa-circle"></i>
                Start Recording
            `;
        }


        if (videoModal) {

            videoModal.hidden =
                true;
        }
    }


    /* =====================================================
       FORM SUBMISSION
    ===================================================== */

    if (form) {

        form.addEventListener(
            "submit",
            function (event) {

                /*
                 * Prevent accidental double-clicks.
                 */

                if (
                    sosButton.disabled
                ) {

                    event.preventDefault();

                    return;
                }


                /*
                 * Make sure emergency type
                 * is selected.
                 */

                const emergencyType =
                    form.querySelector(
                        '[name="emergency_type"]'
                    );


                if (
                    !emergencyType ||
                    !emergencyType.value
                ) {

                    event.preventDefault();

                    alert(
                        "Please select an emergency type."
                    );

                    return;
                }


                /*
                 * Disable button after
                 * validation.
                 */

                sosButton.disabled =
                    true;


                sosButton.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    <span>SENDING</span>
                    <span>SOS</span>
                `;


                /*
                 * Form is allowed to submit
                 * normally to Django.
                 */
            }
        );
    }


    /* =====================================================
       CLEANUP
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        function () {

            /* Stop photo camera */

            if (cameraMediaStream) {

                cameraMediaStream
                    .getTracks()
                    .forEach(
                        function (track) {

                            track.stop();
                        }
                    );
            }


            /* Stop video camera */

            if (videoMediaStream) {

                videoMediaStream
                    .getTracks()
                    .forEach(
                        function (track) {

                            track.stop();
                        }
                    );
            }


            /* Stop active recorder */

            if (
                mediaRecorder &&
                mediaRecorder.state !==
                "inactive"
            ) {

                mediaRecorder.stop();
            }
        }
    );

});