/**
 * Home landing — engineering services catalog.
 * Image paths are centralized here so assets can be swapped without hunting components.
 *
 * Sources (see docs/SERVICE_IMAGE_SOURCES.md):
 * - solar, bess, access: Origin / in-repo field photography
 * - cctv: in-repo camera wall photography (cctv-pole)
 * - automation: in-repo gate automation photography (cctv-main)
 * - ev: Unsplash temporary licensed stand-in until company photo available
 */
import solarImg from '@/assets/pdf-assets/solar-2.jpg';
import cctvImg from '@/assets/pdf-assets/cctv-pole.jpg';
import bessImg from '@/assets/pdf-assets/project-ondo.jpg';
import accessImg from '@/assets/pdf-assets/access-1.jpg';
import automationImg from '@/assets/pdf-assets/cctv-main.jpg';
import evImg from '@/assets/services/ev-charging.jpg';

/** All service deep-links currently resolve to the Services page (no per-service routes yet). */
export const SERVICES_PAGE = '/services';

export const homeServices = [
  {
    id: 'solar',
    featured: true,
    category: 'Solar Energy',
    title: 'Solar PV Systems',
    description:
      'Grid-tied, off-grid, and hybrid installations — from homes to commercial plants — engineered for Nigerian conditions.',
    image: solarImg,
    imageAlt: 'Origin engineers installing solar panels on a corrugated metal rooftop',
    objectPosition: 'center 28%',
    icon: 'sun',
    cta: 'Explore service',
    to: SERVICES_PAGE
  },
  {
    id: 'cctv',
    category: 'Surveillance',
    title: 'CCTV & Surveillance',
    description:
      'IP camera networks, NVR platforms, and professionally organized monitoring for sites that cannot afford blind spots.',
    image: cctvImg,
    imageAlt: 'Multiple professional outdoor CCTV security cameras mounted on a brick wall',
    objectPosition: 'center 40%',
    icon: 'cctv',
    cta: 'Explore service',
    to: SERVICES_PAGE
  },
  {
    id: 'bess',
    category: 'Energy Storage',
    title: 'BESS & Battery Solutions',
    description:
      'Battery racks, hybrid inverters, and switchgear sized for reliable backup when the grid fails.',
    image: bessImg,
    imageAlt: 'Installed battery bank with hybrid inverters and distribution boards',
    objectPosition: 'center 40%',
    icon: 'battery',
    cta: 'Explore service',
    to: SERVICES_PAGE
  },
  {
    id: 'access',
    category: 'Access Control',
    title: 'Access Control Systems',
    description:
      'Card readers, biometric terminals, and door controllers for buildings that need accountable entry.',
    image: accessImg,
    imageAlt: 'Smart card being used with an electronic door access reader',
    objectPosition: 'center 45%',
    icon: 'fingerprint',
    cta: 'Explore service',
    to: SERVICES_PAGE
  },
  {
    id: 'automation',
    category: 'Smart Automation',
    title: 'Smart Home & Automation',
    description:
      'Gate automation, smart access, lighting controls, and connected building systems designed for reliable daily use.',
    image: automationImg,
    imageAlt: 'Automated driveway gates opening with remote control and visible gate-motor hardware',
    objectPosition: 'center 45%',
    icon: 'home',
    cta: 'Explore service',
    to: SERVICES_PAGE
  },
  {
    id: 'ev',
    category: 'EV Charging',
    title: 'EV Charging Infrastructure',
    description:
      'Wall-boxes to site charging points — electrical design and installation for reliable vehicle charging.',
    image: evImg,
    imageAlt: 'Electric vehicle connected to a charging cable at a charging port',
    objectPosition: 'center 55%',
    icon: 'zap',
    cta: 'Explore service',
    to: SERVICES_PAGE,
    temporaryImage: true
  }
];
