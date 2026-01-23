const CONFIG = {
    // ভার্সেলে ডেপ্লয় করার পর আপনার ভার্সেল URL এখানে দেবেন
    API_BASE: window.location.origin + "/api", 
    
    TABS: {
        USERS: "Users",
        PACKAGES: "Packages",
        ORDERS: "Orders",
        NOTIFICATIONS: "Notifications"
    }
};

// ডাটা ফেচিং ফাংশন (শুধুমাত্র GET এর জন্য)
async function fetchData(tabName) {
    // সরাসরি SheetDB ব্যবহার করছি শুধু ডাটা দেখানোর জন্য (নিরাপদ)
    const targetUrl = `https://sheetdb.io/api/v1/3dn8ej3m7h685?sheet=${tabName}`;
    try {
        const response = await fetch(targetUrl);
        return await response.json();
    } catch (error) {
        return null;
    }
}
