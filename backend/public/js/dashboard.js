
    const dashboardData = <%- JSON.stringify(dashboard || {}) %>;
    const summary = dashboardData.summary || {};
    const categoryWise = dashboardData.categoryWise || [];
    const statusWise = dashboardData.statusWise || [];
    const monthly = dashboardData.monthly || [];
    const staffPerformance = dashboardData.staffPerformance || [];
    const averageCompletionTime = Number(dashboardData.averageCompletionTime || 0);

    console.log("Dashboard Data:", dashboardData);

    const currentDateElement = document.getElementById("currentDate");

    if (currentDateElement) {
        currentDateElement.textContent = new Date().toLocaleDateString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    const averageTimeElement = document.getElementById("averageCompletionTime");

    if (averageTimeElement) {
        if (averageCompletionTime > 0) {
            const totalHours = averageCompletionTime / (1000 * 60 * 60);

            if (totalHours < 1) {
                const minutes = Math.max(1, Math.round(totalHours * 60));
                averageTimeElement.textContent = `${minutes}m`;
            } else {
                const hours = Math.floor(totalHours);
                const minutes = Math.round((totalHours - hours) * 60);
                averageTimeElement.textContent =
                    minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
            }
        } else {
            averageTimeElement.textContent = "0h";
        }
    }

    Chart.defaults.font.family =
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif";

    Chart.defaults.color = "#64748b";

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: "index",
        },
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    padding: 18,
                    boxWidth: 8,
                },
            },
            tooltip: {
                padding: 12,
                cornerRadius: 8,
            },
        },
    };

    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const monthlyLabels = monthly.map((item) => {
        const month = Number(item.month);
        const year = Number(item.year);

        return `${monthNames[month - 1]} ${year}`;
    });

    const monthlyTotal = monthly.map((item) =>
        Number(item.totalRequests || 0)
    );

    const monthlyCompleted = monthly.map((item) =>
        Number(item.completedRequests || 0)
    );

    const monthlyPending = monthly.map((item) =>
        Number(item.pendingRequests || 0)
    );

    const monthlyCanvas = document.getElementById("monthlyChart");

    if (monthlyCanvas && monthlyLabels.length) {
        new Chart(monthlyCanvas, {
            type: "line",
            data: {
                labels: monthlyLabels,
                datasets: [
                    {
                        label: "Total Requests",
                        data: monthlyTotal,
                        borderWidth: 3,
                        tension: 0.35,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        fill: false,
                    },
                    {
                        label: "Completed",
                        data: monthlyCompleted,
                        borderWidth: 2,
                        tension: 0.35,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        fill: false,
                    },
                    {
                        label: "Pending",
                        data: monthlyPending,
                        borderWidth: 2,
                        tension: 0.35,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        fill: false,
                    },
                ],
            },
            options: {
                ...commonOptions,
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                        },
                    },
                },
            },
        });
    } else {
        document.getElementById("monthlyEmpty")?.classList.replace("hidden", "flex");
    }

    const statusLabels = statusWise.map((item) => formatStatus(item.status));

    const statusValues = statusWise.map((item) =>
        Number(item.total || 0)
    );

    const statusCanvas = document.getElementById("statusChart");

    if (statusCanvas && statusLabels.length) {
        new Chart(statusCanvas, {
            type: "doughnut",
            data: {
                labels: statusLabels,
                datasets: [
                    {
                        label: "Requests",
                        data: statusValues,
                        borderWidth: 3,
                        hoverOffset: 8,
                    },
                ],
            },
            options: {
                ...commonOptions,
                cutout: "68%",
            },
        });
    } else {
        document.getElementById("statusEmpty")?.classList.replace("hidden", "flex");
    }

    const categoryLabels = categoryWise.map(
        (item) => item.category || "Unknown"
    );

    const categoryValues = categoryWise.map((item) =>
        Number(item.totalRequests || 0)
    );

    const categoryCanvas = document.getElementById("categoryChart");

    if (categoryCanvas && categoryLabels.length) {
        new Chart(categoryCanvas, {
            type: "bar",
            data: {
                labels: categoryLabels,
                datasets: [
                    {
                        label: "Requests",
                        data: categoryValues,
                        borderWidth: 0,
                        borderRadius: 5,
                        barThickness: 16,
                    },
                ],
            },
            options: {
                ...commonOptions,
                indexAxis: "y",
                plugins: {
                    ...commonOptions.plugins,
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                        },
                    },
                    y: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            autoSkip: false,
                            font: {
                                size: 11,
                            },
                        },
                    },
                },
            },
        });
    } else {
        document.getElementById("categoryEmpty")?.classList.replace("hidden", "flex");
    }

    const staffLabels = staffPerformance.map(
        (item) => item.staffName || "Unknown Staff"
    );

    const assignedValues = staffPerformance.map((item) =>
        Number(item.assignedRequests || 0)
    );

    const completedValues = staffPerformance.map((item) =>
        Number(item.completedRequests || 0)
    );

    const staffCanvas = document.getElementById("staffChart");

    if (staffCanvas && staffLabels.length) {
        new Chart(staffCanvas, {
            type: "bar",
            data: {
                labels: staffLabels,
                datasets: [
                    {
                        label: "Assigned",
                        data: assignedValues,
                        borderWidth: 0,
                        borderRadius: 5,
                        barThickness: 14,
                    },
                    {
                        label: "Completed",
                        data: completedValues,
                        borderWidth: 0,
                        borderRadius: 5,
                        barThickness: 14,
                    },
                ],
            },
            options: {
                ...commonOptions,
                indexAxis: "y",
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                        },
                    },
                    y: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            autoSkip: false,
                            font: {
                                size: 11,
                            },
                        },
                    },
                },
            },
        });
    } else {
        document.getElementById("staffEmpty")?.classList.replace("hidden", "flex");
    }

    function formatStatus(status) {
        if (!status) {
            return "Unknown";
        }

        return status
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    }
