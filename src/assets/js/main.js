// swiper
// import Swiper from "swiper";
// import { Navigation, EffectFade } from "swiper/modules";

// gsap

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
gsap.registerPlugin(Observer, ScrollTrigger);

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");
	// Common Function - Header Scroll
	if (document.querySelector(".header")) {
		const header = document.querySelector(".header");

		let tl = gsap.timeline({
			scrollTrigger: {
				trigger: header,
				start: "bottom+=30 top",
				end: "bottom+=10 top",
				scrub: 1,
				onEnter: () => {
					setTimeout(() => {
						header.classList.add("sticky");
					}, 300);
				},
				onEnterBack: () => {
					setTimeout(() => {
						header.classList.remove("sticky");
					}, 100);
				},
			},
		});
	}

	const main = document.querySelector("main");
	main.classList.contains("home") ? homeScrollAnimation() : insideScrollAnimation();

	function homeScrollAnimation() {
		const heroCols = document.querySelectorAll(".hero .row .col");
		heroCols.forEach((col, index) => {
			if (index === 0) {
				gsap.fromTo(col, { opacity: 0, x: "-5px" }, { opacity: 1, x: 0, duration: 1.2, ease: "power2.inOut" });
			} else {
				gsap.fromTo(
					col,
					{ opacity: 0 },
					{
						opacity: 1,
						duration: 1.2,
						ease: "power2.inOut",
						onComplete: () => {
							const h1 = col.querySelector(".hero-main-text h1");
							const p = col.querySelector(".hero-main-text p");
							const intro = document.querySelector(".hero .intro");
							gsap.fromTo(h1, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 });
							gsap.fromTo(p, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "-=.35");
							gsap.fromTo(intro, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.85 }, "-=.25");
						},
					}
				);
			}
		});

		const sections = document.querySelectorAll("section");
		const serviceItems = document.querySelectorAll(".services-list .service-item");
		const serviceButton = document.querySelectorAll(".services .flex-wrap");
		const jobsListCards = document.querySelectorAll(".section-jobs-case-list .card");
		const contacItems = document.querySelectorAll(".contact-list .contact-item");

		observeInterSectionRatio(sections, "loaded", 0.23);
		observeInterSectionRatio(serviceItems, "show", 0.7);
		observeInterSectionRatio(serviceButton, "show", 0.45);
		observeInterSectionRatio(jobsListCards, "show", 0.45, true);
		observeInterSectionRatio(contacItems, "show", 0.45, true);
	}

	function observeInterSectionRatio(items, className, threshold, useTimeout = false) {
		// console.log(items);

		if (!items.length) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry, index) => {
					if (entry.intersectionRatio >= threshold) {
						const addClassAndUnobserve = () => {
							entry.target.classList.add(className);
							observer.unobserve(entry.target);
						};
						useTimeout ? setTimeout(addClassAndUnobserve, index * 200) : addClassAndUnobserve();
					}
				});
			},
			{ threshold }
		);

		items.forEach((item) => observer.observe(item));
	}

	function insideScrollAnimation() {
		const heroCols = document.querySelectorAll(".hero .row .col");
		heroCols.forEach((col) => {
			const classMap = {
				"hero-main-img": () =>
					gsap.fromTo(col, { opacity: 0, x: "-5px" }, { opacity: 1, x: 0, duration: 1.2, ease: "power2.inOut" }),
				"hero-main-text-wrap": () =>
					gsap.fromTo(
						col,
						{ opacity: 0 },
						{
							opacity: 1,
							duration: 1.2,
							ease: "power2.inOut",
							onComplete: () => {
								const elements = [
									{ el: col.querySelector(".hero-main-text h1"), delay: 0 },
									{ el: col.querySelector(".hero-main-text p"), delay: 0.35 },
								];

								elements.forEach(({ el, delay }) =>
									gsap.fromTo(el, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, delay })
								);
							},
						}
					),
				"hero-sub-img": () =>
					gsap.fromTo(
						col,
						{ opacity: 0, x: "-7px" },
						{ opacity: 1, x: 0, duration: 1.2, ease: "power2.inOut" },
						"-=.35"
					),
				card: () =>
					gsap.fromTo(
						col,
						{ opacity: 0 },
						{
							opacity: 1,
							duration: 1.2,
							ease: "power2.inOut",
							onComplete: () => {
								col.querySelectorAll(".card-body > *").forEach((item, index) => {
									gsap.fromTo(
										item,
										{ opacity: 0, y: 35 },
										{ opacity: 1, y: 0, duration: 1, ease: "power2.inOut", delay: index * 0.05 }
									);
								});
							},
						},
						"-=1.5"
					),
			};

			for (const [className, animation] of Object.entries(classMap)) {
				if (col.classList.contains(className)) {
					animation();
					break;
				}
			}
		});

		observeInterSectionRatio(document.querySelectorAll(".blog-list .card"), "show", 0.45, true);
		observeInterSectionRatio(document.querySelectorAll(".blog-content-wrap"), "loaded", 0.05);
	}

	// Common Function - Back To Top Button
	const setUpBackToTop = () => {
		const backTopBtn = document.querySelector(".back-top");

		if (!backTopBtn) {
			console.warn("Back to Top button not found in the DOM.");
			return;
		}
		const toggleVisibility = () => {
			backTopBtn.classList.toggle("show", window.scrollY > 200);
		};

		window.addEventListener("scroll", toggleVisibility);
		backTopBtn.addEventListener("click", function () {
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		});
	};

	setUpBackToTop();

	// Index Page - Swiper
	// if (document.querySelector(".blog")) {
	// 	const swiper = new Swiper(".blog .swiper", {
	// 		modules: [Navigation, EffectFade],
	// 		slidesPerView: 1,
	// 		spaceBetween: 24,
	// 		breakpoints: {
	// 			992: {
	// 				slidesPerView: 3,
	// 				spaceBetween: 24,
	// 				effect: "slide",
	// 			},
	// 		},
	// 		navigation: {
	// 			nextEl: ".blog .swiper-button-next",
	// 			prevEl: ".blog .swiper-button-prev",
	// 		},
	// 	});
	// }
});