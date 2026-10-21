document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-minus]").forEach(btn => {
        btn.addEventListener("click", () => {
            const input = btn.parentElement.querySelector("input");
            input.value = Math.max(parseInt(input.min || 1), parseInt(input.value || 1) - 1);
            input.dispatchEvent(new Event("change", {bubbles: true}));
            const form = btn.closest("form");
            if (form && form.classList.contains("cart-qty")) form.submit();
        });
    });

    document.querySelectorAll("[data-plus]").forEach(btn => {
        btn.addEventListener("click", () => {
            const input = btn.parentElement.querySelector("input");
            const max = parseInt(input.max || 999);
            input.value = Math.min(max, parseInt(input.value || 1) + 1);
            input.dispatchEvent(new Event("change", {bubbles: true}));
            const form = btn.closest("form");
            if (form && form.classList.contains("cart-qty")) form.submit();
        });
    });

    setTimeout(() => {
        document.querySelectorAll(".message").forEach(el => {
            el.style.opacity = "0";
            setTimeout(() => el.remove(), 400);
        });
    }, 3500);
});
