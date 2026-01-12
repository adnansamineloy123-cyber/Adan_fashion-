// ১. মেনু বাটনের কাজ (Toggle Menu)
const menuBtn = document.getElementById('menu-btn');

menuBtn.addEventListener('click', () => {
    alert('মেনু অপশনটি শীঘ্রই আসছে! আপনি এখন মোবাইল ভিউতে আছেন।');
});

// ২. 'আরও পড়ুন' বাটনে ক্লিক করলে মেসেজ দেখানো
const readMoreBtn = document.querySelector('.read-more');

readMoreBtn.addEventListener('click', () => {
    // এখানে চাইলে অন্য কোনো পেজে রিডাইরেক্ট করা যায়
    // window.location.href = "post-details.html";
    alert('পুরো পোস্টটি লোড হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।');
});

// ৩. স্ক্রল করলে হেডারের শ্যাডো পরিবর্তন (Optional)
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
    } else {
        header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    }
});
