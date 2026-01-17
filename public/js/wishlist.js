// Wishlist Toggle Functionality
async function toggleWishlist(button, listingId) {
    try {
        const response = await fetch(`/wishlist/${listingId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401 || response.redirected) {
            // User not logged in, redirect to login
            window.location.href = '/login';
            return;
        }

        const data = await response.json();

        if (data.success) {
            if (data.action === 'added') {
                button.classList.add('active');
                button.querySelector('i').classList.remove('fa-regular');
                button.querySelector('i').classList.add('fa-solid');
            } else {
                button.classList.remove('active');
                button.querySelector('i').classList.remove('fa-solid');
                button.querySelector('i').classList.add('fa-regular');

                // If on wishlist page, remove the card
                if (window.location.pathname === '/wishlist') {
                    const card = button.closest('.listing-link');
                    if (card) {
                        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            card.remove();
                            // Update count in header
                            const countEl = document.querySelector('.wishlist-header p');
                            const currentCount = document.querySelectorAll('.listing-card').length;
                            if (countEl) {
                                countEl.textContent = `${currentCount} saved ${currentCount === 1 ? 'listing' : 'listings'}`;
                            }
                            // Show empty state if no listings left
                            if (currentCount === 0) {
                                location.reload();
                            }
                        }, 300);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error toggling wishlist:', error);
    }
}

// Initialize wishlist buttons on page load
document.addEventListener('DOMContentLoaded', function () {
    // Add click handlers to all wishlist buttons
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        const listingId = btn.dataset.listingId;
        if (listingId && !btn.hasAttribute('onclick')) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(this, listingId);
            });
        }
    });
});
