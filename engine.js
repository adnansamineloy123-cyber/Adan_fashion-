async function joinMatch(matchID, fee) {
    const user = JSON.parse(localStorage.getItem('loggedUser'));
    const btn = event.target;

    if (parseInt(user.Coins) < parseInt(fee)) {
        alert("ACCESS DENIED: Insufficient Coins!");
        return;
    }

    btn.innerText = "PROCESING...";
    btn.disabled = true;

    try {
        const response = await fetch(`${CONFIG.API_BASE}/join-match`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                gameID: user.Game_ID,
                matchID: matchID,
                fee: fee
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert("SUCCESS: Balance Deducted & Order Placed!");
            await refreshUserData(); // ব্যালেন্স রিফ্রেশ
        } else {
            alert(result.message || "Failed to join");
        }
    } catch (err) {
        alert("Server Error!");
    } finally {
        btn.innerText = "JOIN_MATCH";
        btn.disabled = false;
    }
}
