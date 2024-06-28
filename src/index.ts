import barba from '@barba/core'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

window.Webflow ||= []
window.Webflow.push(() => {
  gsap.registerPlugin(ScrollToPlugin)

  barba.init({
    debug: true,
    prevent: ({ href }) => {
      return href.includes('#')
    },
    transitions: [
      {
        name: 'fade',
        leave: (data) => {
          return gsap
            .to(data.current.container, {
              duration: 0.5,
              opacity: 0,
            })
            .then(() => {})
        },
        enter: (data) => {
          gsap.from(data.next.container, {
            opacity: 0,
            duration: 1,
          })
        },
      },
    ],
  })

  function scrollToElement(targetId: string) {
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      gsap.to(window, {
        scrollTo: { y: targetElement.offsetTop, autoKill: false },
        duration: 1,
        ease: 'sine.inOut',
      })
    }
  }

  const servicesLink = document.getElementById('services-link')
  if (servicesLink) {
    servicesLink.addEventListener('click', function (event) {
      const targetId = 'offers'
      event.preventDefault()

      if (window.location.pathname === '/') {
        scrollToElement(targetId)
      } else {
        localStorage.setItem('anchor', targetId)
        barba.go('/')
      }
    })
  }

  barba.hooks.after(() => {
    const anchor = localStorage.getItem('anchor')

    if (anchor) {
      scrollToElement(anchor)
      localStorage.removeItem('anchor')
    }
  })
})
