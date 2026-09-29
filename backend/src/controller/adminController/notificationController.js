
export const renderNotificationPage = async (req, res) => {
  try {
    return res.render("admin/notification/index", {
      title: "Notifications",
    });
  } catch (error) {
    console.log("renderNotificationPage error:", error);

    return res.status(500).render("admin/error", {
      message: "Failed to load notifications",
    });
  }
};