import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import {
  FiArrowDownRight,
  FiArrowRight,
  FiArrowUpRight,
  FiBriefcase,
  FiCheck,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiCpu,
  FiCompass,
  FiFilm,
  FiFolder,
  FiGitBranch,
  FiGlobe,
  FiLayers,
  FiLock,
  FiMail,
  FiMessageSquare,
  FiMenu,
  FiMonitor,
  FiPhone,
  FiPlay,
  FiTarget,
  FiX,
} from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaWhatsapp, FaYoutube } from 'react-icons/fa6';
import { company } from './data/company';
import { services } from './data/services';
import { portfolio } from './data/portfolio';
import { customerLogos } from './data/customerLogos';
import { industries } from './data/industries';
import { navigation } from './data/navigation';
import { teamMembers } from './data/team';
import { testimonials } from './data/testimonials';
import { knowledgeHubVideos } from './data/knowledgeHubVideos';
import { knowledgeHubWorkImages } from './data/knowledgeHubWorkImages';
import TeamCard from './Components/TeamCard';
import headerLogo from './Images/Logonew.png';
import './CanmaSite.css';

const contact = company;
const navItems = navigation;
const heroFrameContext = process.env.NODE_ENV === 'test'
  ? null
  : require.context('./Images/ezgif-2bfc8f583a817676-jpg', false, /^\.\/ezgif-frame-\d+\.jpg$/);
const heroFrames = heroFrameContext ? heroFrameContext.keys()
  .sort((first, second) => Number(first.match(/\d+/)[0]) - Number(second.match(/\d+/)[0]))
  .map((frame) => heroFrameContext(frame)) : [];

const pageMeta = {
  '/': ['CANMABiz (PVT) LTD | Professional Business Solutions', 'Business, digital marketing, website and creative production solutions for startups, SMEs and growing organisations.'],
  '/about': ['About CANMABiz | Business Solutions Partner', 'CANMABiz provides professional business solutions to startups, SMEs, corporate organisations and growing businesses across diverse industries.'],
  '/services': ['Services | CANMABiz', 'Explore CANMABiz business solutions, digital marketing, website services and creative production.'],
  '/business-solutions': ['Business Solutions | CANMABiz', 'Business consultation, financial guidance, HR support, SOP development and more.'],
  '/digital-marketing': ['Digital Marketing | CANMABiz', 'Social media management and digital advertising services for businesses.'],
  '/website-solutions': ['Software Solutions | CANMABiz', 'Professional website and software solutions, including custom system development, business applications, website design, support and optimization.'],
  '/production': ['CANMABiz Production | Creative Services', 'Photography, video, graphic design and promotional production services.'],
  '/portfolio': ['Portfolio | CANMABiz', 'Businesses referenced in the CANMABiz business proposal.'],
  '/industries': ['Industries | CANMABiz', 'Business solutions for organisations across a range of industries.'],
  '/process': ['Our Process | CANMABiz', 'An overview of how CANMABiz works with businesses, with process stages to be confirmed.'],
  '/why-us': ['Why CANMABiz | Business Solutions Partner', 'Discover the principles behind CANMABiz business solutions.'],
  '/team': ['Our Team | CANMABiz', 'Meet the people behind CANMABiz, with profiles published on the company website.'],
  '/reviews': ['Reviews | CANMABiz', 'Client reviews will be added when approved testimonials are available.'],
  '/knowledge-hub': ['Knowledge Hub | CANMABiz', 'Business and marketing insights from CANMABiz.'],
  '/contact': ['Contact CANMABiz | Let’s Talk', 'Contact CANMABiz about business, digital marketing, website and production services.'],
  '/privacy': ['Privacy Policy | CANMABiz', 'Privacy policy information for CANMABiz.'],
  '/terms': ['Terms & Conditions | CANMABiz', 'Terms and conditions information for CANMABiz.'],
};

function scrollToTop() {
  if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    scrollToTop();
  }, [location.pathname]);

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 18);
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth > 1024) setMenuOpen(false);
    };
    window.addEventListener('resize', closeOnDesktop);
    return () => window.removeEventListener('resize', closeOnDesktop);
  }, []);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
      <div className="nav-wrap">
        <Link className="wordmark" to="/" aria-label="CANMABiz home">
          <img src={headerLogo} alt="CANMABiz" />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map(([label, path]) => (
            <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{label}</NavLink>
          ))}
          <Link className="nav-cta" to="/contact">Let’s Talk <FiArrowUpRight aria-hidden="true" /></Link>
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
      <div className={`mobile-nav${menuOpen ? ' open' : ''}`} id="mobile-navigation" aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          {navItems.map(([label, path], index) => (
            <NavLink key={path} to={path} tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}>
              <span>0{index + 1}</span>{label}<FiArrowUpRight aria-hidden="true" />
            </NavLink>
          ))}
          <Link className="mobile-contact" to="/contact" tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}>Let’s Talk <FiArrowUpRight /></Link>
        </nav>
        <p>Business solutions for the next stage.</p>
      </div>
    </header>
  );
}

function Footer() {
  const socialLinks = [
    { name: 'YouTube', href: 'https://www.youtube.com/@CanmaBiz', icon: <FaYoutube aria-hidden="true" /> },
    { name: 'Facebook', href: 'https://web.facebook.com/profile.php?id=61585383189674', icon: <FaFacebookF aria-hidden="true" /> },
    { name: 'WhatsApp', href: 'https://whatsapp.com/channel/0029VbBPkXD0G0XdADtaFe0Q', icon: <FaWhatsapp aria-hidden="true" /> },
    { name: 'Instagram', href: 'https://www.instagram.com/canmabiz_official', icon: <FaInstagram aria-hidden="true" /> },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/canmabiz', icon: <FaLinkedinIn aria-hidden="true" /> },
    { name: 'TikTok', href: 'https://www.tiktok.com/@canmabizofficial', icon: <FaTiktok aria-hidden="true" /> },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-main wrap">
        <div className="footer-brand">
          <Link className="wordmark wordmark-footer" to="/" aria-label="CANMABiz home">
            <img src={headerLogo} alt="CANMABiz" />
          </Link>
          <p>{company.description}</p>
          <div className="footer-socials" aria-label="CANMABiz social media links">
            {socialLinks.map(({ name, href, icon }) => (
              <a key={name} href={href} target="_blank" rel="noreferrer" aria-label={name} title={name}>
                {icon}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-column"><h3>Explore</h3><Link to="/about">About Us</Link><Link to="/services">Services</Link><Link to="/portfolio">Client Portfolio</Link><Link to="/process">Our Process</Link><Link to="/team">Team</Link><Link to="/reviews">Reviews</Link></div>
        <div className="footer-column"><h3>Solutions</h3>{services.map((service) => <Link key={service.path} to={service.path}>{service.title}</Link>)}<Link to="/knowledge-hub">Knowledge Hub</Link></div>
        <div className="footer-column footer-contact"><h3>Contact</h3><a className="footer-contact-link" href={`mailto:${contact.email}`}><FiMail aria-hidden="true" />{contact.email}</a><a className="footer-contact-link" href={`tel:${contact.phoneLink}`}><FiPhone aria-hidden="true" />{contact.phone}</a></div>
      </div>
      <div className="footer-bottom wrap"><p>© {new Date().getFullYear()} {company.legalName}. All rights reserved.</p><div><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms &amp; Conditions</Link></div><a className="back-top" href="#top" onClick={(event) => { event.preventDefault(); scrollToTop(); }}>Back to top <FiArrowUpRight /></a></div>
    </footer>
  );
}

function SectionHeading({ eyebrow, title, description, light = false }) {
  return <div className={`section-heading${light ? ' section-heading-light' : ''}`}>
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h2>{title}</h2>
    {description && <p className="section-description">{description}</p>}
  </div>;
}

function PageHero({ eyebrow, title, description, breadcrumb, compact = false }) {
  return <section className={`page-hero${compact ? ' page-hero-compact' : ''}`}><div className="wrap page-hero-inner">
    <p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-lede">{description}</p>
    <div className={`page-index${breadcrumb ? ' page-index-breadcrumb' : ''}`}>{breadcrumb ? <span>{breadcrumb}</span> : <><span>{company.legalName}</span><span>Business solutions <FiArrowDownRight /></span></>}</div>
  </div></section>;
}

function ActionLink({ to, children, light = false }) {
  return <Link className={`text-link${light ? ' text-link-light' : ''}`} to={to}>{children}<FiArrowUpRight aria-hidden="true" /></Link>;
}

function CTA({ title = 'Let’s discuss what your business needs next.', description = 'Tell us where you want support. We’ll start with a conversation.' }) {
  return <section className="cta-band"><div className="wrap cta-inner"><div><p className="eyebrow">A good place to start</p><h2>{title}</h2><p>{description}</p></div></div></section>;
}

function HeroFrameCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const page = canvas?.closest('#main-content');
    const context = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !page || !context || heroFrames.length === 0) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const images = new Map();
    const loading = new Set();
    let queue = [];
    let activeLoads = 0;
    let targetFrame = 0;
    let renderedFrame = -1;
    let animationFrame = 0;
    let scrollAnimationFrame = 0;
    let disposed = false;

    page.classList.add('home-scroll-animation');
    document.body.classList.add('home-scroll-animation-active');
    page.dataset.reducedMotion = String(reducedMotion.matches);

    const draw = () => {
      animationFrame = 0;
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 1.75);
      const width = Math.round(bounds.width * pixelRatio);
      const height = Math.round(bounds.height * pixelRatio);
      const resized = canvas.width !== width || canvas.height !== height;
      if (resized) {
        canvas.width = width;
        canvas.height = height;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
      }

      let image = images.get(targetFrame);
      let imageFrame = targetFrame;
      if (!image) {
        for (let distance = 1; distance < heroFrames.length; distance += 1) {
          const previous = images.get(targetFrame - distance);
          const next = images.get(targetFrame + distance);
          if (previous || next) {
            image = previous || next;
            imageFrame = previous ? targetFrame - distance : targetFrame + distance;
            break;
          }
        }
      }
      if (!image || (imageFrame === renderedFrame && !resized)) return;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.fillStyle = '#0a0d12';
      context.fillRect(0, 0, bounds.width, bounds.height);
      const scale = Math.max(bounds.width / image.naturalWidth, bounds.height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      context.drawImage(image, (bounds.width - drawWidth) / 2, (bounds.height - drawHeight) / 2, drawWidth, drawHeight);
      renderedFrame = imageFrame;
    };

    const requestDraw = () => {
      if (!animationFrame && !disposed) animationFrame = window.requestAnimationFrame(draw);
    };

    let pumpQueue = () => {};

    const finishLoad = (index, image, loaded) => {
      loading.delete(index);
      activeLoads -= 1;
      if (!disposed && loaded) {
        images.set(index, image);
        requestDraw();
      }
      for (const cachedIndex of images.keys()) {
        if (Math.abs(cachedIndex - targetFrame) > 8) images.delete(cachedIndex);
      }
      pumpQueue();
    };

    const handleImageLoad = (event) => {
      const image = event.currentTarget;
      const index = Number(image.dataset.frameIndex);
      if (typeof image.decode === 'function') image.decode().then(() => finishLoad(index, image, true)).catch(() => finishLoad(index, image, true));
      else finishLoad(index, image, true);
    };

    const handleImageError = (event) => {
      const image = event.currentTarget;
      finishLoad(Number(image.dataset.frameIndex), image, false);
    };

    pumpQueue = () => {
      while (!disposed && activeLoads < 3 && queue.length) {
        const index = queue.shift();
        if (images.has(index) || loading.has(index)) continue;
        loading.add(index);
        activeLoads += 1;
        const image = new Image();
        image.decoding = 'async';
        image.dataset.frameIndex = String(index);
        image.onload = handleImageLoad;
        image.onerror = handleImageError;
        image.src = heroFrames[index];
      }
    };

    const loadNearbyFrames = (center) => {
      queue = queue.filter((index) => Math.abs(index - center) <= 8);
      [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5].forEach((offset) => {
        const index = center + offset;
        if (index >= 0 && index < heroFrames.length && !images.has(index) && !loading.has(index) && !queue.includes(index)) queue.push(index);
      });
      pumpQueue();
    };

    const updateFromScroll = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      page.dataset.reducedMotion = String(prefersReducedMotion);
      const footer = document.querySelector('.site-footer');
      if (!prefersReducedMotion && footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const canvasHeight = canvas.getBoundingClientRect().height;
        const bottomInset = Math.min(canvasHeight, Math.max(0, canvasHeight - Math.max(0, footerTop)));
        canvas.style.clipPath = `inset(0 0 ${bottomInset}px 0)`;
      } else {
        canvas.style.clipPath = 'none';
      }
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const pageBottom = page.getBoundingClientRect().bottom + scrollTop;
      const progress = pageBottom > 0 ? Math.max(0, Math.min(1, scrollTop / pageBottom)) : 0;
      const nextFrame = prefersReducedMotion ? 0 : Math.round(progress * (heroFrames.length - 1));
      if (nextFrame !== targetFrame) {
        targetFrame = nextFrame;
        renderedFrame = -1;
        requestDraw();
      }
      loadNearbyFrames(targetFrame);
    };

    const scheduleScrollUpdate = () => {
      if (scrollAnimationFrame || disposed) return;
      scrollAnimationFrame = window.requestAnimationFrame(() => {
        scrollAnimationFrame = 0;
        updateFromScroll();
      });
    };

    const handleViewportChange = () => {
      updateFromScroll();
      requestDraw();
    };

    const pageResizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(scheduleScrollUpdate);
    pageResizeObserver?.observe(page);

    loadNearbyFrames(0);
    updateFromScroll();
    window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
    window.addEventListener('resize', handleViewportChange);
    reducedMotion.addEventListener('change', handleViewportChange);

    return () => {
      disposed = true;
      window.removeEventListener('scroll', scheduleScrollUpdate);
      window.removeEventListener('resize', handleViewportChange);
      reducedMotion.removeEventListener('change', handleViewportChange);
      pageResizeObserver?.disconnect();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      if (scrollAnimationFrame) window.cancelAnimationFrame(scrollAnimationFrame);
      page.classList.remove('home-scroll-animation');
      document.body.classList.remove('home-scroll-animation-active');
      delete page.dataset.reducedMotion;
    };
  }, []);

  return <canvas className="hero-photo" ref={canvasRef} aria-hidden="true" />;
}

function HomePage() {
  return <>
    <section className="home-hero" id="top">
      <HeroFrameCanvas />
      <div className="hero-team-background" role="img" aria-label="The CANMABiz team" />
      <div className="hero-shade" />
      <div className="wrap hero-content">
        <div className="hero-copy-block">
          <p className="eyebrow">Professional business solutions</p>
          <h1>Build better.<br /><span>Grow with clarity.</span><br /><span className="hero-third-line">Lead with purpose.</span></h1>
          <p className="hero-copy">Business, digital and creative solutions shaped around the needs of your organisation.</p>
          <div className="hero-actions"><Link className="button button-accent" to="/services">Explore our services <FiArrowUpRight /></Link><Link className="hero-secondary" to="/about">Discover CANMABiz <FiArrowRight /></Link></div>
        </div>
      </div>
     </section>
    <section className="intro-section wrap" id="intro">
      <div className="intro-label"><span className="eyebrow">01 / Who we are</span><span className="intro-rule" /></div>
      <div className="intro-copy"><h2>A business partner for the work ahead.</h2><p>{company.legalName} provides professional, customised solutions to startups, SMEs, corporate organisations and growing businesses. We bring business guidance, digital expertise and creative production together, shaped to fit each organisation.</p><ActionLink to="/about">Discover CANMABiz</ActionLink></div>
      
    </section>

    <section className="services-section section-pad">
      <div className="wrap"><div className="section-topline"><SectionHeading eyebrow="02 / What we do" title={<>Solutions that move<br />your business forward.</>} description="A connected range of capabilities, brought together around your business priorities." /><ActionLink to="/services">View all services</ActionLink></div>
        <div className="service-grid">{services.map((service) => <ServiceCard service={service} key={service.number} />)}</div>
      </div>
    </section>

    <section className="industries-section section-pad"><div className="wrap industries-layout"><div><p className="eyebrow">03 / Across industries</p><h2>Different sectors.<br />Individual needs.</h2><p className="body-copy">The company proposal notes more than 20 businesses, with experience across sectors including:</p><ActionLink to="/industries">Explore industries</ActionLink></div><div className="industry-list">{industries.map((industry, index) => <Link key={industry} to="/industries"><span>0{index + 1}</span>{industry}<FiArrowUpRight /></Link>)}</div></div></section>

    <section className="why-section section-pad"><div className="wrap why-layout"><div className="why-heading"><p className="eyebrow">04 / Why CANMABiz</p><h2>One partner.<br />A broader view.</h2><p className="body-copy">Business needs rarely sit in one place. CANMABiz brings professional guidance, digital services and production capabilities under one roof.</p><ActionLink to="/why-us">What sets us apart</ActionLink></div><div className="why-points">{[
      ['01', 'One-stop business solutions', 'A connected range of business, digital and creative services.'],
      ['02', 'Tailor-made strategies', 'Solutions developed around your organisation and its priorities.'],
      ['03', 'Professional team', 'Experienced support across the services CANMABiz provides.'],
      ['04', 'End-to-end digital marketing', 'Campaign support from planning through monitoring and optimisation.'],
    ].map(([number, title, description]) => <div className="why-point" key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div><FiArrowUpRight /></div>)}</div></div></section>

    <section className="customer-showcase section-pad" aria-label="Trusted CANMABiz customer companies">
      <div className="wrap customer-showcase-inner">
        <div className="customer-copy"><p className="eyebrow">05 / Our valued customers</p><h2>Trusted by<br />businesses.</h2><p>A selection of businesses CANMABiz is proud to work alongside.</p><ActionLink to="/portfolio">View portfolio references</ActionLink></div>
        <div className="customer-marquee">
          <div className="customer-track">
            {[false, true].map((isDuplicate) => <div className="customer-logo-set" key={String(isDuplicate)} aria-hidden={isDuplicate}>
              {customerLogos.map((logo) => <div className="customer-logo" key={logo.name}><img src={logo.image} alt={isDuplicate ? '' : `${logo.name} logo`} loading={isDuplicate ? 'eager' : 'lazy'} draggable="false" /></div>)}
            </div>)}
          </div>
        </div>
      </div>
    </section>
    <CTA />
  </>;
}

function ServiceCard({ service }) {
  const Icon = service.icon;
  return <Link className={`service-card accent-${service.accent}`} to={service.path}><div className="service-card-top"><span>{service.number}</span><Icon aria-hidden="true" /></div><h3>{service.title}</h3><p>{service.description}</p><span className="service-card-link">Explore service <FiArrowUpRight /></span></Link>;
}

function AboutPage() {
  const capabilities = [
    'Business Consultation', 'Marketing Strategy', 'Digital Marketing', 'Financial Guidance',
    'HR Support', 'Business Funding Guidance', 'IT Support', 'SOP System Development',
    'Website Development', 'Creative Production',
  ];

  return <><PageHero eyebrow="Company / About" title={<>Business solutions.<br />Built for growth.</>} description="CANMABiz (Pvt) Ltd is a trusted business solutions company providing a complete range of professional services to startups, SMEs, corporate organizations, and growing businesses. Our expertise includes Business Consultation, Marketing Strategy, Digital Marketing, Financial Guidance, HR Support, Business Funding Guidance, IT Support, SOP System Development, Website Development, and Creative Production, delivering customized solutions that support sustainable business growth." />
    <section className="about-capabilities section-pad"><div className="wrap about-capabilities-layout"><div className="about-capabilities-heading"><p className="eyebrow">One partner / Connected expertise</p><h2>Practical support.<br />A broader view.</h2><p>We combine strategic expertise, digital innovation, and creative excellence to meet the unique requirements of every client.</p><ActionLink to="/services">Explore our services</ActionLink></div><ol className="about-capability-list">{capabilities.map((capability, index) => <li key={capability}><span>{String(index + 1).padStart(2, '0')}</span><strong>{capability}</strong></li>)}</ol></div></section>
    <section className="about-client-section section-pad"><div className="wrap"><div className="about-client-intro"><div className="about-client-stat"><strong>20+</strong><span>clients served</span></div><div className="about-client-copy"><p className="eyebrow">Trusted across industries</p><h2>Insight shaped by<br />different industries.</h2><p>Today, more than 20 clients trust CANMABiz for a wide range of professional services across diverse industries. Our industry experience helps us understand the unique requirements of each business and deliver innovative, practical, and results-driven solutions that create lasting value for our clients.</p></div></div><div className="about-industry-list">{industries.map((industry, index) => <div key={industry}><span>{String(index + 1).padStart(2, '0')}</span><strong>{industry}</strong><FiArrowUpRight aria-hidden="true" /></div>)}</div></div></section>
    <CTA title="Let’s build what comes next." description="Tell us where your business is heading and explore the support that fits." />
  </>;
}

function ServicesPage() {
  return <><PageHero eyebrow="Capabilities / Services" title="What We Do" description="At CANMABiz (Pvt) Ltd, we provide end-to-end business solutions that empower organizations to build strong brands, improve operational efficiency, and achieve sustainable growth. Our team combines strategic expertise, digital innovation, and creative excellence to deliver customized solutions that meet the unique requirements of every client." />
    <section className="service-overview section-pad"><div className="wrap"><div className="service-overview-heading"><p className="eyebrow">Connected expertise</p><p>Explore tailored support across business strategy, digital growth, websites and creative production.</p></div><div className="service-list">{services.map((service) => { const Icon = service.icon; return <article className={`service-row accent-${service.accent}`} key={service.number}><span className="service-number">{service.number}</span><div className="service-row-title"><Icon aria-hidden="true" /><div><span className="service-row-label">CANMABiz / {service.number}</span><h2>{service.title}</h2></div></div><div className="service-row-details"><p>{service.description}</p>{service.groups ? service.groups.map((group) => <div className="service-offering-group" key={group.title}><h3>{group.title}</h3><ul className="service-offerings">{group.items.map((item) => <li key={item}>{item}</li>)}</ul></div>) : <ul className="service-offerings">{service.items.map((item) => <li key={item}>{item}</li>)}</ul>}<ActionLink to={service.path}>Explore {service.title}</ActionLink></div></article>; })}</div></div></section>
    <CTA title="Not sure where to begin?" description="Share a little about your business and the support you’re looking for." />
  </>;
}

function ServiceDetailPage({ service }) {
  const Icon = service.icon;
  return <><PageHero eyebrow={`Capabilities / ${service.number}`} title={<>{service.title.split(' ').slice(0, -1).join(' ')}<br />{service.title.split(' ').slice(-1)}</>} description={service.description} />
    <section className={`detail-intro wrap accent-${service.accent}`}><div className="detail-icon"><Icon /></div><div><p className="eyebrow">What this includes</p><h2>Professional support, tailored to your business.</h2><p>Discuss your requirements with CANMABiz to identify the services that fit your organisation and current priorities.</p></div></section>
    {service.number === '03' && <WebsitePreview />}
    {service.number === '04' && <ProductionShowcase />}
    <section className="detail-services section-pad"><div className="wrap">{service.groups ? service.groups.map((group) => <ServiceGroup key={group.title} title={group.title} items={group.items} />) : <ServiceGroup title={service.title} items={service.items} />}</div></section><CTA />
  </>;
}

function WebsitePreview() {
  return <section className="website-showcase"><div className="wrap website-showcase-grid"><div><p className="eyebrow">Illustrative website layout</p><h2>A clearer digital first impression.</h2><p>This browser-style mockup is a visual example, not a published client website.</p></div><div className="browser-mockup" role="img" aria-label="Illustrative business website preview in a browser frame"><div className="browser-toolbar"><span /><span /><span /><i>Business website preview</i></div><div className="browser-canvas"><div className="preview-nav"><strong>BRAND</strong><span>About&nbsp;&nbsp; Services&nbsp;&nbsp; Contact</span></div><div className="preview-hero"><div><small>BUSINESS / SOLUTIONS</small><strong>Make room<br />for what’s next.</strong><span>Explore the possibilities</span></div><div className="preview-image-block" /></div><div className="preview-lines"><i /><i /><i /></div></div></div></div></section>;
}

function ProductionShowcase() {
  return <section className="production-showcase"><div className="wrap production-showcase-grid"><div><p className="eyebrow">Creative production</p><h2>Make the message visible.</h2><p>Illustrative service categories. Images and completed client work can be added when approved assets are available.</p></div><div className="production-tiles"><div className="production-tile tile-brand"><span>01 / BRAND</span><FiLayers /><strong>Identity</strong></div><div className="production-tile tile-motion"><span>02 / MOTION</span><FiFilm /><strong>Video</strong></div><div className="production-tile tile-photo"><span>03 / IMAGE</span><FiTarget /><strong>Photography</strong></div></div></div></section>;
}

function ServiceGroup({ title, items }) {
  return <div className="service-group"><h2>{title}</h2><div className="service-item-grid">{items.map((item, index) => <div className="service-item" key={item}><span>0{index + 1}</span><p>{item}</p><FiArrowUpRight /></div>)}</div></div>;
}

function PortfolioPage() {
  const [filter, setFilter] = useState('All');
  const filters = ['All', ...Array.from(new Set(portfolio.map((item) => item.category)))];
  const visibleItems = filter === 'All' ? portfolio : portfolio.filter((item) => item.category === filter);
  return <><PageHero eyebrow="Experience / Portfolio" title={<>Business names.<br />Shared experience.</>} description="A selection of businesses and organisations named in the CANMABiz proposal. Project details can be added as they are confirmed." />
    <section className="portfolio-section section-pad"><div className="wrap"><div className="filter-bar" role="group" aria-label="Filter portfolio by industry">{filters.map((category) => <button key={category} className={filter === category ? 'filter-button selected' : 'filter-button'} onClick={() => setFilter(category)}>{category}</button>)}</div><div className="portfolio-grid">{visibleItems.map((item, index) => { const hasLogo = Boolean(item.image); return <article className="portfolio-card" key={item.name}><div className={`portfolio-placeholder${hasLogo ? ' has-logo' : ''}`}><span>CANMABiz / {String(index + 1).padStart(2, '0')}</span>{hasLogo ? <img src={item.image} alt={`${item.name} logo`} /> : <FiLayers aria-hidden="true" />}</div><div className="portfolio-card-info"><div><h2>{item.name}</h2><p>{item.category}</p></div><span className="portfolio-open" aria-label="Portfolio reference"><FiArrowUpRight /></span></div></article>; })}</div><p className="editor-note">Client names and industry categories are shown as provided. Project descriptions, locations and imagery are not available in the supplied material.</p></div></section><CTA />
  </>;
}

function IndustriesPage() {
  const icons = [FiLayers, FiGlobe, FiCompass, FiBriefcase, FiTarget, FiMonitor, FiArrowDownRight];
  return <><PageHero eyebrow="Experience / Industries" title={<>Different industries.<br />Solutions that fit.</>} description="CANMABiz works with businesses across a range of sectors, adapting its support to the needs of each organisation." />
    <section className="industries-page section-pad"><div className="wrap"><div className="industry-card-grid">{industries.map((industry, index) => { const Icon = icons[index]; return <article className="industry-card" key={industry}><div><span>0{index + 1}</span><Icon /></div><h2>{industry}</h2><p>Customised business support shaped around the sector and organisation.</p></article>; })}</div></div></section><CTA />
  </>;
}

function ProcessPage() {
  return <><PageHero eyebrow="Working together / Our process" title={<>A thoughtful start<br />to the right support.</>} description="CANMABiz's exact project stages were not detailed in the available materials. This section is structured for the confirmed process to be added." />
    <section className="process-section section-pad"><div className="wrap"><SectionHeading eyebrow="Process framework" title="A clear place for each step." description="Editable process stages, pending confirmation from CANMABiz." /><div className="process-list">{['Stage name to confirm', 'Stage name to confirm', 'Stage name to confirm', 'Stage name to confirm'].map((stage, index) => <div className="process-step" key={index}><span>0{index + 1}</span><h2>{stage}</h2><p>Process description to be added from approved company information.</p><FiArrowDownRight /></div>)}</div></div></section><CTA />
  </>;
}

function WhyUsPage() {
  const principles = [
    { number: '01', title: 'Trust', icon: FiCheckCircle, description: 'Trust is earned through consistency. We deliver what we promise, communicate transparently, and never overstate what we can achieve. Our 98% client retention rate speaks for itself.', commitments: ['NDA-backed engagements as standard', 'Clear, honest communication at all times', 'No hidden fees or surprise scope changes'] },
    { number: '02', title: 'Process', icon: FiGitBranch, description: 'Our structured methodology eliminates guesswork and ensures every engagement delivers consistent, measurable outcomes, regardless of industry or business size.', commitments: ['Discovery → Analysis → Strategy → Execution', 'Regular milestone reviews and reporting', 'Agile adjustments as conditions change'] },
    { number: '03', title: 'Expertise', icon: FiCpu, description: 'Our team brings over 10 years of combined experience across finance, technology, retail, manufacturing, and professional services, giving you depth across every challenge.', commitments: ['Specialists, not generalists', 'Cross-industry insight and pattern recognition', 'Continuous professional development'] },
    { number: '04', title: 'Confidentiality', icon: FiLock, description: 'Your business information, strategies, and challenges are handled with the highest level of discretion. We treat your data as we would our own, with absolute care.', commitments: ['Mandatory NDA before any engagement', 'Secure document handling and storage', 'Strict information compartmentalisation'] },
  ];
  const comparisons = [
    ['Tailored Strategy', 'Always custom', 'Template-based'],
    ['NDA & Confidentiality', 'Mandatory standard', 'Optional / extra cost'],
    ['Implementation Support', 'End-to-end', 'Strategy only'],
    ['Client Retention Rate', '98%', 'Industry average ~65%'],
    ['Response Time', 'Within 24 hours', '3–5 business days'],
    ['SME Specialisation', 'Core focus', 'Enterprise-first'],
  ];

  return <><PageHero eyebrow="The CANMABiz Difference" title={<>Why Businesses<br />Choose Us</>} description="We don't just consult — we partner. Here's what sets CANMABiz apart from every other advisory firm." breadcrumb="Home / Why Us" compact />
    <section className="principles-section section-pad"><div className="wrap"><div className="principle-intro"><p className="eyebrow">Our four pillars</p><h2>Built on Trust &amp; Excellence</h2><p>Every engagement we take on is grounded in four non-negotiable principles that define how we work and who we are.</p></div><div className="principle-grid">{principles.map(({ number, title, icon: Icon, description, commitments }) => <article className="principle-card" key={number}><div className="principle-topline"><span>{number}</span><Icon aria-hidden="true" /></div><h2>{title}</h2><p>{description}</p><ul>{commitments.map((commitment) => <li key={commitment}><FiCheck aria-hidden="true" />{commitment}</li>)}</ul></article>)}</div></div></section>
    <section className="difference-section section-pad"><div className="wrap"><div className="difference-heading"><p className="eyebrow">The difference</p><h2>CANMABiz vs The Rest</h2><p>A clear comparison of what you can expect when working with us.</p></div><div className="comparison-table" role="table" aria-label="CANMA-Biz compared with a typical firm"><div className="comparison-header" role="row"><span role="columnheader">What matters</span><strong role="columnheader">CANMABiz</strong><strong role="columnheader">Typical firm</strong></div>{comparisons.map(([criterion, canmaBiz, typicalFirm]) => <div className="comparison-row" role="row" key={criterion}><strong role="rowheader">{criterion}</strong><span className="comparison-canma" data-label="CANMA-Biz"><FiCheck aria-hidden="true" />{canmaBiz}</span><span className="comparison-typical" data-label="Typical firm">{typicalFirm}</span></div>)}</div></div></section><CTA />
  </>;
}

function TeamPage() {
  return <><PageHero eyebrow="The people behind the work" title={<>Meet the people<br />behind CANMABiz.</>} description="The people bringing our business, finance, operations, technology and creative work together." />
    <section className="team-intro"><div className="wrap team-intro-grid"><p className="eyebrow">People &amp; expertise</p><div><h2>Different disciplines.<br />One shared purpose.</h2><p>Meet the people behind CANMABiz and the expertise they bring to every part of our work.</p></div></div></section>
    <section className="team-group"><div className="wrap"><div className="team-group-heading"><div><p className="eyebrow">CANMABiz / Our people</p><h2>Our Team</h2></div></div><div className="team-grid">{teamMembers.map((member) => <TeamCard member={member} key={member.id} />)}</div></div></section>
    <CTA title="Work with our team" description="Talk with CANMABiz about the business support your organisation needs." />
  </>;
}

function TestimonialCard({ testimonial }) {
  return <article className="testimonial-card"><div className="testimonial-topline"><span className="quote-mark" aria-hidden="true">“</span><span className="review-stars" aria-label={`${testimonial.rating} out of 5 stars`}>{'★'.repeat(testimonial.rating)}</span></div><blockquote>{testimonial.quote}</blockquote><div className="testimonial-byline"><strong>{testimonial.name}</strong><span>{[testimonial.role, testimonial.company].filter(Boolean).join(' · ')}</span><small>{testimonial.service}</small></div></article>;
}

function ReviewsPage() {
  return <><PageHero eyebrow="Client perspectives" title={<>Trust is built<br />in the work.</>} description="Client stories published on the CANMABiz company website, with the names, roles and companies attributed there." />
    <section className="reviews-section"><div className="wrap"><div className="reviews-intro"><p className="eyebrow">Reviews &amp; testimonials</p><h2>Published client<br /><span>perspectives.</span></h2><p>These testimonials and attributions are presented as published on the CANMABiz website.</p></div>{testimonials.length ? <div className="testimonials-grid">{testimonials.map((testimonial) => <TestimonialCard key={testimonial.id} testimonial={testimonial} />)}</div> : <div className="reviews-empty"><div className="reviews-empty-mark"><FiMessageSquare /></div><div><span className="eyebrow">Client voices</span><h3>Approved testimonials are being prepared.</h3><p>There are no verified testimonials available to publish at this time. This section is ready for attributed client feedback.</p></div><span className="reviews-empty-index">01 / 01</span></div>}</div></section><CTA title="Start a conversation with CANMABiz" />
  </>;
}

const isValidYoutubeId = (id) => /^[\w-]{11}$/.test(id);

function KnowledgeVideoCard({ video, index, onSelect }) {
  const fallbackTitle = `Knowledge Hub video ${index + 1}`;
  const title = video.title.trim() || fallbackTitle;
  const [thumbnail, setThumbnail] = useState(
    isValidYoutubeId(video.id) ? `https://img.youtube.com/vi/${video.id}/hqdefault.jpg` : '',
  );
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

  const handleThumbnailError = () => {
    if (thumbnail && !thumbnail.endsWith('/0.jpg')) {
      setThumbnail(`https://img.youtube.com/vi/${video.id}/0.jpg`);
      return;
    }
    setThumbnailFailed(true);
  };

  return (
    <article className="knowledge-video-card">
      <button
        className="knowledge-video-trigger"
        type="button"
        onClick={(event) => onSelect(video, event.currentTarget)}
        aria-label={`Play ${title}`}
      >
        <span className="knowledge-video-thumbnail">
          {thumbnail && !thumbnailFailed
            ? <img src={thumbnail} alt="" loading="lazy" onError={handleThumbnailError} />
            : <span className="knowledge-video-thumbnail-fallback" aria-hidden="true"><FiFilm /></span>}
          <span className="knowledge-video-play" aria-hidden="true"><FiPlay /></span>
        </span>
      </button>
    </article>
  );
}

function KnowledgeVideoModal({ video, onClose, closeButtonRef, triggerRef }) {
  const [embedFailed, setEmbedFailed] = useState(!isValidYoutubeId(video.id));
  const title = video.title.trim() || 'Knowledge Hub video';

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement;
    const focusedTrigger = triggerRef.current;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key !== 'Tab') return;

      const modal = document.querySelector('.knowledge-video-dialog');
      const focusable = modal?.querySelectorAll('button, a[href], iframe');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (focusedTrigger?.isConnected) focusedTrigger.focus();
      else if (previousActiveElement instanceof HTMLElement) previousActiveElement.focus();
    };
  }, [closeButtonRef, onClose, triggerRef]);

  const embedUrl = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0`;

  return (
    <div
      className="knowledge-video-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="knowledge-video-dialog" role="dialog" aria-modal="true" aria-labelledby="knowledge-video-title">
        <div className="knowledge-video-dialog-heading">
          <div>
            <span className="knowledge-video-category">CANMABiz / Knowledge Hub</span>
            <h2 id="knowledge-video-title">{title}</h2>
          </div>
          <button ref={closeButtonRef} className="knowledge-video-close" type="button" onClick={onClose} aria-label="Close video">
            <FiX aria-hidden="true" />
          </button>
        </div>
        <div className="knowledge-video-player">
          {embedFailed
            ? <div className="knowledge-video-unavailable" role="status"><FiFilm aria-hidden="true" /><p>The video player could not be loaded. You can still watch this video on YouTube.</p></div>
            : <iframe
              src={embedUrl}
              title={`${title} video player`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              onError={() => setEmbedFailed(true)}
            />}
        </div>
        <p className="knowledge-video-help">If playback is unavailable, continue watching on YouTube.</p>
        <a className="knowledge-video-youtube-link" href={video.youtubeUrl} target="_blank" rel="noreferrer">
          Open original video on YouTube <FiArrowUpRight aria-hidden="true" />
        </a>
      </section>
    </div>
  );
}

function KnowledgeWorkGallery({ onSelect }) {
  return (
    <div className="knowledge-work-grid" aria-label="CANMABiz work image gallery">
      {knowledgeHubWorkImages.map((work, index) => (
        <button
          className="knowledge-work-card"
          key={work.label}
          type="button"
          onClick={(event) => onSelect(index, event.currentTarget)}
          aria-label={`View work image ${String(index + 1).padStart(2, '0')}`}
        >
          <span className="knowledge-work-image">
            <img src={work.image} alt="" loading="lazy" />
            <span className="knowledge-work-view" aria-hidden="true"><FiArrowUpRight /></span>
          </span>
        </button>
      ))}
    </div>
  );
}

function KnowledgeWorkModal({ index, onClose, onNavigate, closeButtonRef, triggerRef }) {
  const work = knowledgeHubWorkImages[index];
  const activeIndexRef = useRef(index);
  activeIndexRef.current = index;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement;
    const focusedTrigger = triggerRef.current;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onNavigate((activeIndexRef.current - 1 + knowledgeHubWorkImages.length) % knowledgeHubWorkImages.length);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNavigate((activeIndexRef.current + 1) % knowledgeHubWorkImages.length);
      } else if (event.key === 'Tab') {
        const dialog = document.querySelector('.knowledge-work-dialog');
        const focusable = dialog?.querySelectorAll('button');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (focusedTrigger?.isConnected) focusedTrigger.focus();
      else if (previousActiveElement instanceof HTMLElement) previousActiveElement.focus();
    };
  }, [closeButtonRef, onClose, onNavigate, triggerRef]);

  return (
    <div
      className="knowledge-work-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="knowledge-work-dialog" role="dialog" aria-modal="true" aria-label={`Work image ${String(index + 1).padStart(2, '0')}`}>
        <div className="knowledge-work-dialog-top">
          <span>{String(index + 1).padStart(2, '0')} / {String(knowledgeHubWorkImages.length).padStart(2, '0')}</span>
          <button ref={closeButtonRef} className="knowledge-video-close" type="button" onClick={onClose} aria-label="Close work image">
            <FiX aria-hidden="true" />
          </button>
        </div>
        <div className="knowledge-work-viewer">
          <button
            className="knowledge-work-navigation previous"
            type="button"
            aria-label="Previous work image"
            onClick={() => onNavigate((index - 1 + knowledgeHubWorkImages.length) % knowledgeHubWorkImages.length)}
          >
            <FiChevronLeft aria-hidden="true" />
          </button>
          <img src={work.image} alt={`CANMABiz ${work.label.toLowerCase()}`} />
          <button
            className="knowledge-work-navigation next"
            type="button"
            aria-label="Next work image"
            onClick={() => onNavigate((index + 1) % knowledgeHubWorkImages.length)}
          >
            <FiChevronRight aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
}

function KnowledgeHubPage() {
  const [activeCollection, setActiveCollection] = useState('videos');
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeWorkIndex, setActiveWorkIndex] = useState(null);
  const closeButtonRef = useRef(null);
  const triggerRef = useRef(null);

  const selectVideo = (video, trigger) => {
    triggerRef.current = trigger;
    setActiveVideo(video);
  };
  const closeVideo = () => setActiveVideo(null);
  const selectWork = (index, trigger) => {
    triggerRef.current = trigger;
    setActiveWorkIndex(index);
  };
  const closeWork = useCallback(() => setActiveWorkIndex(null), []);

  return <>
    <PageHero
      eyebrow="CANMABiz / Knowledge Hub"
      title={<>Ideas To Move<br />Business Forward.</>}
      description="Explore practical insights, perspectives and stories from CANMABiz — curated to help ambitious businesses think clearly and grow with confidence."
      breadcrumb="Home / Knowledge Hub"
    />
    <section className="knowledge-library">
      <div className="wrap knowledge-library-content">
        <div className="knowledge-collection-switch" role="tablist" aria-label="Knowledge Hub collections">
          <button
            id="knowledge-videos-tab"
            className={activeCollection === 'videos' ? 'knowledge-collection-tab active' : 'knowledge-collection-tab'}
            type="button"
            role="tab"
            aria-selected={activeCollection === 'videos'}
            tabIndex={activeCollection === 'videos' ? 0 : -1}
            aria-controls="knowledge-collection-panel"
            onClick={() => setActiveCollection('videos')}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') {
                event.preventDefault();
                setActiveCollection('work');
                document.getElementById('knowledge-work-tab')?.focus();
              }
            }}
          >
            <FiFilm aria-hidden="true" /> Videos 
          </button>
          <button
            id="knowledge-work-tab"
            className={activeCollection === 'work' ? 'knowledge-collection-tab active' : 'knowledge-collection-tab'}
            type="button"
            role="tab"
            aria-selected={activeCollection === 'work'}
            tabIndex={activeCollection === 'work' ? 0 : -1}
            aria-controls="knowledge-collection-panel"
            onClick={() => setActiveCollection('work')}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft') {
                event.preventDefault();
                setActiveCollection('videos');
                document.getElementById('knowledge-videos-tab')?.focus();
              }
            }}
          >
            <FiFolder aria-hidden="true" /> Our Work
          </button>
        </div>
        <div id="knowledge-collection-panel" role="tabpanel" aria-labelledby={activeCollection === 'videos' ? 'knowledge-videos-tab' : 'knowledge-work-tab'}>
          {activeCollection === 'videos' ? <>
            <div className="knowledge-work-heading">
              <div><span className="knowledge-work-eyebrow"><FiFilm aria-hidden="true" /> CANMABiz / Knowledge Library</span><h2>Knowledge you can put to work.</h2><p>Discover useful insights and practical lessons from CANMABiz videos—ideas you can take away and apply to your business.</p></div>
            </div>
            <div className="knowledge-library-meta"><span><i aria-hidden="true" />Official CANMABiz videos</span></div>
            <div className="knowledge-video-grid" aria-label="CANMABiz video library">
              {knowledgeHubVideos.map((video, index) => (
                <KnowledgeVideoCard key={video.id} video={video} index={index} onSelect={selectVideo} />
              ))}
            </div>
          </> : <>
            <div className="knowledge-work-heading">
              <div><span className="knowledge-work-eyebrow"><FiFolder aria-hidden="true" /> CANMABiz / Work Gallery</span><h2>Our work, in pictures.</h2><p>Browse moments and projects from the CANMABiz work collection.</p></div>
            </div>
            <KnowledgeWorkGallery onSelect={selectWork} />
          </>}
        </div>
      </div>
    </section>
    <CTA title="Looking for support right now?" description="Explore the services CANMABiz can tailor to your organisation." />
    {activeVideo && <KnowledgeVideoModal video={activeVideo} onClose={closeVideo} closeButtonRef={closeButtonRef} triggerRef={triggerRef} />}
    {activeWorkIndex !== null && <KnowledgeWorkModal index={activeWorkIndex} onClose={closeWork} onNavigate={setActiveWorkIndex} closeButtonRef={closeButtonRef} triggerRef={triggerRef} />}
  </>;
}

function ContactPage() {
  const [status, setStatus] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Website enquiry: ${formData.get('service')}`);
    const body = encodeURIComponent([
      `Name: ${formData.get('name')}`, `Email: ${formData.get('email')}`,
      `Phone: ${formData.get('phone') || 'Not provided'}`, `Company: ${formData.get('company') || 'Not provided'}`,
      `Service required: ${formData.get('service')}`, '', String(formData.get('message')),
    ].join('\n'));
    setStatus('Your email app will open with your enquiry ready to send.');
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  };
  return <><PageHero eyebrow="Get in touch / Contact" title={<>Let’s talk about<br />your business.</>} description="Tell us what you’re working on and where you’d like support. Contact CANMABiz directly or send an enquiry." />
    <section className="contact-section section-pad"><div className="wrap contact-layout"><div className="contact-details"><p className="eyebrow">Contact details</p><h2>Start with a conversation.</h2><p>Reach CANMABiz using the contact details below. There’s no office address listed here because one was not available in the supplied information.</p><a href={`mailto:${contact.email}`}><span><FiMail /></span><div><small>Email</small><strong>{contact.email}</strong></div><FiArrowUpRight /></a><a href={`tel:${contact.phoneLink}`}><span><FiPhone /></span><div><small>Phone</small><strong>{contact.phone}</strong></div><FiArrowUpRight /></a><a href={`https://wa.me/${contact.phoneLink.replace('+', '')}`} target="_blank" rel="noreferrer"><span className="whatsapp-symbol">WA</span><div><small>WhatsApp</small><strong>Message CANMABiz</strong></div><FiArrowUpRight /></a></div>
      <form className="contact-form" onSubmit={handleSubmit}><div className="form-heading"><h2>Send an enquiry</h2><p>Fields marked * are required. Your email app will be used to send the message.</p></div><div className="form-grid"><label>Name *<input name="name" autoComplete="name" required /></label><label>Email *<input name="email" type="email" autoComplete="email" required /></label><label>Phone<input name="phone" type="tel" autoComplete="tel" /></label><label>Company<input name="company" autoComplete="organization" /></label><label className="form-wide">Service required *<select name="service" required defaultValue=""><option value="" disabled>Select a service</option>{services.map((service) => <option key={service.path} value={service.title}>{service.title}</option>)}</select></label><label className="form-wide">Message *<textarea name="message" rows="5" required /></label></div><button className="button button-dark" type="submit">Prepare enquiry <FiArrowUpRight /></button>{status && <p className="form-status" role="status">{status}</p>}</form>
    </div></section>
  </>;
}

function LegalPage({ isPrivacy }) {
  if (isPrivacy) {
    return <>
      <PageHero eyebrow="CANMABiz / Privacy" title="Privacy Policy" description="This Privacy Policy explains how CANMABiz (PVT) LTD collects, uses, protects and manages information in connection with our website, business services, and client communication." />
      <section className="legal-content wrap">
        <div className="legal-shell">
          <div className="legal-callout">
            <p className="eyebrow">Our commitment</p>
            <h2>Information is treated with care.</h2>
            <p>CANMABiz is committed to protecting the privacy of clients, website visitors, and business contacts. We collect only the information needed to respond to enquiries, provide services, and improve the experience on our website.</p>
          </div>

          <div className="legal-grid">
            <article className="legal-card">
              <p className="eyebrow">01 / Information we collect</p>
              <ul className="legal-list">
                <li>Contact information such as name, email address, phone number, and company name.</li>
                <li>Business requirements and service enquiries submitted through our website or email.</li>
                <li>Website analytics data including browser type, device, pages visited, and referring source.</li>
                <li>Communication records related to projects, client support, and business discussions.</li>
              </ul>
            </article>

            <article className="legal-card">
              <p className="eyebrow">02 / How we use it</p>
              <ul className="legal-list">
                <li>Responding to service enquiries and project discussions.</li>
                <li>Providing business consultation, digital marketing, website, and creative support.</li>
                <li>Maintaining communication, scheduling, and project updates.</li>
                <li>Improving our website experience and understanding business needs.</li>
              </ul>
            </article>

            <article className="legal-card">
              <p className="eyebrow">03 / Information sharing</p>
              <ul className="legal-list">
                <li>We do not sell personal information to third parties.</li>
                <li>We may share information with trusted service providers only when required for communication, hosting, analytics, or service delivery.</li>
                <li>Information may also be disclosed where required by law, professional obligations, or regulatory processes.</li>
              </ul>
            </article>

            <article className="legal-card">
              <p className="eyebrow">04 / Cookies and analytics</p>
              <ul className="legal-list">
                <li>We may use cookies and similar technologies to remember preferences and understand site performance.</li>
                <li>Analytics tools help us evaluate traffic patterns and improve website usability.</li>
                <li>Users can manage browser preferences to limit or disable cookies where applicable.</li>
              </ul>
            </article>

            <article className="legal-card">
              <p className="eyebrow">05 / Security and retention</p>
              <ul className="legal-list">
                <li>We implement reasonable security measures to protect information from unauthorised access, misuse, or disclosure.</li>
                <li>Information is retained only for as long as required to fulfil business purposes, legal obligations, or client communication needs.</li>
                <li>Where information is no longer needed, it will be securely deleted or anonymised when appropriate.</li>
              </ul>
            </article>

            <article className="legal-card">
              <p className="eyebrow">06 / Your rights</p>
              <ul className="legal-list">
                <li>Request access to personal information we hold about you.</li>
                <li>Ask for correction or update of inaccurate personal information.</li>
                <li>Request removal of information where retention is no longer necessary, subject to legal or contractual limitations.</li>
                <li>Opt out of non-essential marketing communication where applicable.</li>
              </ul>
            </article>
          </div>

          <div className="legal-summary">
            <h3>Contact us</h3>
            <p>If you have questions about this Privacy Policy or how your information is handled, please contact {company.legalName} at <a href={`mailto:${contact.email}`}>{contact.email}</a> or call <a href={`tel:${contact.phoneLink}`}>{contact.phone}</a>.</p>
          </div>
        </div>
      </section>
    </>;
  }

  return <>
    <PageHero eyebrow="CANMABiz / Terms" title="Terms & Conditions" description="These Terms & Conditions govern the use of the CANMABiz website and the business relationship between CANMABiz (PVT) LTD and its clients and visitors." />
    <section className="legal-content wrap">
      <div className="legal-shell">
        <div className="legal-callout">
          <p className="eyebrow">Website use</p>
          <h2>Clear terms for a professional relationship.</h2>
          <p>By accessing or using the CANMABiz website, you agree to be bound by these terms. These terms apply to website visitors, prospective clients, and any parties interacting with CANMABiz for business, service, marketing, or production support.</p>
        </div>

        <div className="legal-grid">
          <article className="legal-card">
            <p className="eyebrow">01 / Acceptance of terms</p>
            <ul className="legal-list">
              <li>Use of this website indicates acceptance of these Terms & Conditions.</li>
              <li>CANMABiz may update these terms at any time and continued use of the website indicates acceptance of the revised version.</li>
              <li>Any service engagement is subject to a separate agreement, proposal, or statement of work where applicable.</li>
            </ul>
          </article>

          <article className="legal-card">
            <p className="eyebrow">02 / Service scope</p>
            <ul className="legal-list">
              <li>CANMABiz provides business solutions, digital marketing support, website services, and production services tailored to client needs.</li>
              <li>Scope, deliverables, timelines, and responsibilities will be agreed in writing before work begins.</li>
              <li>Requests for additional work outside the agreed scope may be charged separately.</li>
            </ul>
          </article>

          <article className="legal-card">
            <p className="eyebrow">03 / Client responsibilities</p>
            <ul className="legal-list">
              <li>Clients are responsible for providing accurate information, timely approvals, and access to required assets or platforms.</li>
              <li>Delays caused by incomplete information, late feedback, or unavailable client resources are not the responsibility of CANMABiz.</li>
              <li>Clients are expected to communicate clearly and respond within agreed timelines.</li>
            </ul>
          </article>

          <article className="legal-card">
            <p className="eyebrow">04 / Intellectual property</p>
            <ul className="legal-list">
              <li>CANMABiz retains ownership of its templates, frameworks, methods, and pre-existing materials used in service delivery.</li>
              <li>Client-provided content, branding assets, and business information remain the property of the client unless otherwise agreed.</li>
              <li>Final deliverables will be governed by the project agreement and any specific licensing or transfer terms agreed in writing.</li>
            </ul>
          </article>

          <article className="legal-card">
            <p className="eyebrow">05 / Payments and project delivery</p>
            <ul className="legal-list">
              <li>Project costs, payment milestones, and acceptance criteria will be clearly communicated before work starts.</li>
              <li>Late payments may result in delays to work, suspension of services, or additional charges as agreed.</li>
              <li>Client approval is required before final delivery or public release of content or assets where applicable.</li>
            </ul>
          </article>

          <article className="legal-card">
            <p className="eyebrow">06 / Confidentiality and data</p>
            <ul className="legal-list">
              <li>CANMABiz will handle confidential information responsibly and in line with applicable professional and legal standards.</li>
              <li>Information shared by the client remains subject to the relevant project agreement and privacy expectations.</li>
              <li>CANMABiz may not disclose confidential information except where required by law or with the client’s consent.</li>
            </ul>
          </article>

          <article className="legal-card">
            <p className="eyebrow">07 / Limitation of liability</p>
            <ul className="legal-list">
              <li>CANMABiz aims to provide quality professional services, but we do not guarantee outcomes beyond those explicitly agreed in writing.</li>
              <li>We shall not be liable for indirect, incidental, or consequential losses arising from website use or business engagements, except where required by law.</li>
              <li>Our aggregate liability is limited to the value of services directly related to the relevant engagement, subject to applicable legal limits.</li>
            </ul>
          </article>

          <article className="legal-card">
            <p className="eyebrow">08 / External links and content</p>
            <ul className="legal-list">
              <li>The website may contain links to external websites or third-party resources.</li>
              <li>CANMABiz is not responsible for the content, privacy practices, or availability of external websites.</li>
              <li>Visitors access external links at their own discretion and should review the relevant terms and policies of those third parties.</li>
            </ul>
          </article>
        </div>

        <div className="legal-summary">
          <h3>Governing law</h3>
          <p>These Terms & Conditions are governed by the laws applicable to CANMABiz (PVT) LTD and the relevant jurisdiction in which the service or transaction is conducted. Any dispute arising in connection with website use or a service agreement will be addressed through good-faith discussions, and legal remedies may be pursued where required.</p>
          <p>For enquiries, please contact <a href={`mailto:${contact.email}`}>{contact.email}</a> or call <a href={`tel:${contact.phoneLink}`}>{contact.phone}</a>.</p>
        </div>
      </div>
    </section>
  </>;
}

function NotFoundPage() {
  return <section className="not-found"><div className="wrap"><p className="eyebrow">404 / Page not found</p><h1>This page isn’t<br />part of the plan.</h1><p>The page may have moved or the link may be incorrect.</p><Link className="button button-dark" to="/">Return to home <FiArrowUpRight /></Link></div></section>;
}

function FloatingContactButton() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const actions = [
    { label: 'WhatsApp', href: `https://wa.me/${company.phoneLink.replace('+', '')}`, icon: <FaWhatsapp aria-hidden="true" />, external: true },
    { label: 'Email', href: `mailto:${company.email}`, icon: <FiMail aria-hidden="true" />, external: true },
    { label: 'Phone', href: `tel:${company.phoneLink}`, icon: <FiPhone aria-hidden="true" />, external: true },
    { label: 'Contact', href: '/contact', icon: <FiArrowUpRight aria-hidden="true" />, external: false },
  ];

  return (
    <div className="floating-contact-wrap" ref={wrapperRef}>
      <div className={`floating-contact-menu${open ? ' open' : ''}`} role="menu" aria-label="Quick contact options">
        {actions.map(({ label, href, icon, external }) => (
          <a key={label} className="floating-contact-action" href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} onClick={() => setOpen(false)}>
            {icon}
            <span>{label}</span>
          </a>
        ))}
      </div>
      <button type="button" className="floating-contact-button" aria-expanded={open} aria-label={open ? 'Close contact options' : 'Open contact options'} onClick={() => setOpen((current) => !current)}>
        <span className="floating-contact-button-text">Get in touch</span>
        <span className="floating-contact-button-icon"><FiArrowUpRight aria-hidden="true" /></span>
      </button>
    </div>
  );
}

export default function CanmaSite() {
  const location = useLocation();
  useEffect(() => {
    const [title, descriptionText] = pageMeta[location.pathname] || ['Page not found | CANMABiz', 'The requested CANMABiz page could not be found.'];
    document.title = title;
    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.name = 'description';
      document.head.appendChild(description);
    }
    description.content = descriptionText;
    let openGraph = document.querySelector('meta[property="og:description"]');
    if (!openGraph) {
      openGraph = document.createElement('meta');
      openGraph.setAttribute('property', 'og:description');
      document.head.appendChild(openGraph);
    }
    openGraph.content = descriptionText;
    let openGraphTitle = document.querySelector('meta[property="og:title"]');
    if (!openGraphTitle) {
      openGraphTitle = document.createElement('meta');
      openGraphTitle.setAttribute('property', 'og:title');
      document.head.appendChild(openGraphTitle);
    }
    openGraphTitle.content = title;
    const socialMetadata = [
      ['meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image'],
      ['meta[name="twitter:title"]', 'name', 'twitter:title', title],
      ['meta[name="twitter:description"]', 'name', 'twitter:description', descriptionText],
    ];
    socialMetadata.forEach(([selector, attribute, key, value]) => {
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }
      meta.content = value;
    });
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://canmabiz.com${location.pathname === '/' ? '/' : location.pathname}`;
  }, [location.pathname]);

  return <><a className="skip-link" href="#main-content">Skip to content</a><Header /><main id="main-content"><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/services" element={<ServicesPage />} />
    {services.map((service) => <Route key={service.path} path={service.path} element={<ServiceDetailPage service={service} />} />)}
    <Route path="/portfolio" element={<PortfolioPage />} />
    <Route path="/industries" element={<IndustriesPage />} />
    <Route path="/process" element={<ProcessPage />} />
    <Route path="/why-us" element={<WhyUsPage />} />
    <Route path="/team" element={<TeamPage />} />
    <Route path="/reviews" element={<ReviewsPage />} />
    <Route path="/knowledge-hub" element={<KnowledgeHubPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/privacy" element={<LegalPage isPrivacy />} />
    <Route path="/terms" element={<LegalPage isPrivacy={false} />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes></main><Footer /><FloatingContactButton /></>;
}