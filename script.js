// ১. ট্যাব পরিবর্তনের লজিক (All, Man, Women, Kids)
const chips = document.querySelectorAll('.chip');

chips.forEach(chip => {
    chip.addEventListener('click', () => {
        // আগে থেকে একটিভ থাকা চিপ থেকে 'active' ক্লাস রিমুভ করা
        document.querySelector('.chip.active').classList.remove('active');
        // যেটিতে ক্লিক করা হয়েছে সেটিতে 'active' ক্লাস যোগ করা
        chip.classList.add('active');
        
        // এখানে আপনি ভবিষ্যতে ডাটা ফিল্টার করার কোড লিখতে পারেন
        console.log(chip.innerText + " category selected");
    });
});

// ২. উইশলিস্ট (Heart Icon) টগল করার লজিক
const wishlistIcons = document.querySelectorAll('.wishlist-icon');

wishlistIcons.forEach(icon => {
    icon.addEventListener('click', function() {
        // আইকনটি টগল করা (ভরাট হার্ট বনাম খালি হার্ট)
        const heart = this.querySelector('i');
        if (heart.classList.contains('fa-regular')) {
            heart.classList.replace('fa-regular', 'fa-solid');
            this.classList.add('active');
        } else {
            heart.classList.replace('fa-solid', 'fa-regular');
            this.classList.remove('active');
        }
    });
});

// ৩. কার্টে পণ্য যোগ করার লজিক
const addButtons = document.querySelectorAll('.add-to-cart');
const cartBadge = document.querySelector('.cart-badge');
let cartCount = parseInt(cartBadge.innerText);

addButtons.forEach(button => {
    button.addEventListener('click', () => {
        // কার্ট সংখ্যা বাড়ানো
        cartCount++;
        cartBadge.innerText = cartCount;

        // বাটন ফিডব্যাক
        const originalText = button.innerText;
        button.innerText = "Added!";
        button.style.backgroundColor = "#c5a059"; // গোল্ডেন কালার ফিডব্যাক
        button.style.color = "#1a2a3a";

        // ১.৫ সেকেন্ড পর বাটন আগের অবস্থায় ফিরিয়ে আনা
        setTimeout(() => {
            button.innerText = originalText;
            button.style.backgroundColor = ""; // CSS থেকে আগের কালার নিবে
            button.style.color = "";
        }, 1500);
    });
});

// ৪. বটম নেভিগেশন একটিভ স্টেট পরিবর্তন
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        // পেজ রিফ্রেশ বন্ধ রাখা (যেহেতু এটি ডেমো)
        e.preventDefault();
        
        document.querySelector('.nav-item.active').classList.remove('active');
        this.classList.add('active');
    });
});

// ৫. সার্চ বারে এন্টার প্রেস করলে কনসোলে দেখানো
const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        alert("Searching for: " + searchInput.value);
    }
});
