

document.addEventListener("DOMContentLoaded", () => {
    if (typeof Notyf === "undefined") {
        console.error("Notyf is not loaded");
        return;
    }

    const notyf = new Notyf({
        duration: 3000,
        position: {
            x: "right",
            y: "top",
        },
        dismissible: true,
    });

    window.toast = {
        success(message) {
            notyf.success(message);
        },

        error(message) {
            notyf.error(message);
        },

        info(message) {
            notyf.open({
                type: "info",
                message,
            });
        },

        warning(message) {
            notyf.open({
                type: "warning",
                message,
            });
        },
    };

    console.log("Toast initialized");
});