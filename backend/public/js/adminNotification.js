const AdminNotification = (() => {

  const countElement = () => {
    return document.getElementById("notificationUnreadCount");
  };


  function renderUnreadCount(count) {
window.AdminNotification = (() => {
  const countElement = () => {
    return document.getElementById("notificationUnreadCount");
  };

  function renderUnreadCount(count) {
    const element = countElement();

    if (!element) return;

    const unreadCount = Math.max(Number(count) || 0, 0);

    element.textContent =
      unreadCount > 99
        ? "99+"
        : unreadCount;

    if (unreadCount > 0) {
      element.classList.remove("hidden");
      element.classList.add("flex");
    } else {
      element.classList.add("hidden");
      element.classList.remove("flex");
    }
  }

  async function getUnreadCount() {
    try {
      const response = await fetch(
        "/notification/getunreadcount",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch unread count"
        );
      }

      const unreadCount =
        result.data?.unreadCount ?? 0;

      renderUnreadCount(unreadCount);

      return unreadCount;
    } catch (error) {
      console.error(
        "getUnreadCount error:",
        error
      );

      return 0;
    }
  }

  function increaseUnreadCount(amount = 1) {
    const element = countElement();

    if (!element) {
      // If the navbar/count element isn't available,
      // fetch the real count instead.
      getUnreadCount();
      return;
    }

    const text = element.textContent || "0";

    const current =
      text === "99+"
        ? 99
        : Number(text) || 0;

    renderUnreadCount(current + amount);
  }

  function decreaseUnreadCount(amount = 1) {
    const element = countElement();

    if (!element) return;

    const text = element.textContent || "0";

    const current =
      text === "99+"
        ? 99
        : Number(text) || 0;

    renderUnreadCount(
      Math.max(current - amount, 0)
    );
  }

  function setUnreadCount(count) {
    renderUnreadCount(count);
  }

  return {
    getUnreadCount,
    increaseUnreadCount,
    decreaseUnreadCount,
    setUnreadCount,
    renderUnreadCount,
  };
})();
    const element = countElement();

    if (!element) return;

    const unreadCount = Math.max(Number(count) || 0, 0);

    element.textContent =
      unreadCount > 99
        ? "99+"
        : unreadCount;

    if (unreadCount > 0) {
      element.classList.remove("hidden");
      element.classList.add("flex");
    } else {
      element.classList.add("hidden");
      element.classList.remove("flex");
    }
  }


  async function getUnreadCount() {

    try {

      const response = await fetch(
        "/notification/getunreadcount",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch unread count"
        );
      }

      const unreadCount =
        result.data?.unreadCount ?? 0;

      renderUnreadCount(unreadCount);

      return unreadCount;

    } catch (error) {

      console.error(
        "getUnreadCount error:",
        error
      );

      return 0;
    }
  }


  function increaseUnreadCount(amount = 1) {

    const element = countElement();

    if (!element) return;

    const current =
      Number(element.textContent.replace("+", "")) || 0;

    renderUnreadCount(current + amount);
  }


  function decreaseUnreadCount(amount = 1) {

    const element = countElement();

    if (!element) return;

    const current =
      Number(element.textContent.replace("+", "")) || 0;

    renderUnreadCount(
      Math.max(current - amount, 0)
    );
  }


  function setUnreadCount(count) {
    renderUnreadCount(count);
  }


  return {
    getUnreadCount,
    increaseUnreadCount,
    decreaseUnreadCount,
    setUnreadCount,
    renderUnreadCount,
  };

})();