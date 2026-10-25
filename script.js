const siteNavigation = document.querySelector("#site-navigation");
const navigationToggle = document.querySelector(".site-nav-toggle");

document.body.classList.add("has-js");

if (siteNavigation && navigationToggle) {
    const closeNavigation = () => {
        siteNavigation.classList.remove("site-nav--open");
        navigationToggle.setAttribute("aria-expanded", "false");
        navigationToggle.setAttribute("aria-label", "Ouvrir le menu");
    };

    navigationToggle.addEventListener("click", () => {
        const isExpanded = navigationToggle.getAttribute("aria-expanded") === "true";

        siteNavigation.classList.toggle("site-nav--open", !isExpanded);
        navigationToggle.setAttribute("aria-expanded", String(!isExpanded));
        navigationToggle.setAttribute(
            "aria-label",
            isExpanded ? "Ouvrir le menu" : "Fermer le menu",
        );
    });

    siteNavigation.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a")) {
            closeNavigation();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeNavigation();
            navigationToggle.focus();
        }
    });

    window.matchMedia("(min-width: 761px)").addEventListener("change", closeNavigation);
}

const contactForm = document.querySelector("#contact-form");
const contactFormStatus = document.querySelector("#contact-form-status");

contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
        return;
    }

    const formData = new FormData(contactForm);
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    submitButton.disabled = true;
    contactFormStatus.textContent = "Envoi de votre demande…";
    contactFormStatus.dataset.state = "sending";

    try {
        const response = await fetch("https://formsubmit.co/ajax/backertwebmaster@gmail.com", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                message,
                _subject: `Demande de projet de ${name}`,
                _replyto: email,
            }),
        });
        const result = await response.json();

        if (!response.ok || !(result.success === true || result.success === "true")) {
            throw new Error(result.message || "Le service n’a pas pu accepter le formulaire.");
        }

        contactFormStatus.textContent = "Merci, votre demande a bien été envoyée. Nous vous répondrons dès que possible.";
        contactFormStatus.dataset.state = "success";
        contactForm.reset();
    } catch (error) {
        console.error("Échec de l’envoi du formulaire de contact :", error);
        contactFormStatus.textContent = error instanceof Error && /activation/i.test(error.message)
            ? "Le formulaire n’est pas encore activé par FormSubmit. Vérifiez le lien d’activation dans votre boîte e-mail, puis réessayez."
            : "L’envoi a échoué. Réessayez ou écrivez-nous à backertwebmaster@gmail.com.";
        contactFormStatus.dataset.state = "error";
    } finally {
        submitButton.disabled = false;
    }
});
