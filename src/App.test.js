import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from './App';

test('renders the CANMABiz homepage and service call to action', () => {
  render(<App />);
  expect(screen.getAllByRole('link', { name: 'CANMABiz home' })).toHaveLength(2);
  expect(document.querySelector('.hero-team-background')).toBeInTheDocument();
  expect(document.querySelector('.hero-team-frame')).not.toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'The CANMABiz team' })).toHaveClass('hero-team-background');
  expect(screen.getByRole('link', { name: /explore our services/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /let’s talk/i })).toBeInTheDocument();
});

test('shows every supplied customer logo in folder order with a seamless duplicate track', () => {
  render(<App />);
  const expectedLogos = [
    'Angel Travels.png', 'Besi Denim Home.png', 'Bubble.png', 'Dubai Advertising.png',
    'Fashion.png', 'Flower.png', 'Gamisiri eco village.png', 'Gemhub.png', 'Glovil.png',
    'Golder Green Plantation.png', 'Idiappa shop.png', 'Revitavermi.png', 'RS Logo.png',
    'Serendib Garments.png', 'Taste Home.png', 'Tecbase.png',
  ];
  const originalTrack = document.querySelector('.customer-logo-set:not([aria-hidden="true"])');
  const duplicateTrack = document.querySelector('.customer-logo-set[aria-hidden="true"]');

  expect(originalTrack.querySelectorAll('img')).toHaveLength(expectedLogos.length);
  expect(Array.from(originalTrack.querySelectorAll('img'), (image) => image.getAttribute('src'))).toEqual(expectedLogos);
  expect(duplicateTrack.querySelectorAll('img')).toHaveLength(expectedLogos.length);
  expect(Array.from(originalTrack.querySelectorAll('img'), (image) => image.alt)).toEqual(expectedLogos.map((filename) => `${filename.replace(/\.png$/i, '')} logo`));
});

test('shows the nine CANMABiz team members in the requested order with portraits', () => {
  render(<App />);
  const mainNavigation = within(screen.getByRole('navigation', { name: 'Main navigation' }));
  fireEvent.click(mainNavigation.getByRole('link', { name: 'Our Team' }));

  expect(screen.getByRole('heading', { name: /meet the people/i })).toBeInTheDocument();
  const expectedMembers = [
    ['Ashen Sharadha', 'Managing Director', 'Ashen Sharadha.png'],
    ['Chathurangani Kulasooriya', 'Director of Finance and Marketing', 'Chathurangani Kulasooriya.png'],
    ['Chamathka Kumbukgolla', 'Director of Human Resources and Administration', 'Chamathka Kumbukgolla.png'],
    ['Navod Hewamanna', 'Secretary / Director of Operations and IT', 'Navod Hewamanna.png'],
    ['Praveen Manupriya', 'Head of Production', 'Praveen Manupriya.png'],
    ['Shyni Dickson', 'Head of Digital Media Marketing', 'Shyni Dickson.png'],
    ['Hiruni Weerasinghe', 'Head of Finance', 'Hiruni Weerasinghe.png'],
    ['Sahan Narangoda', 'Head of Information Technology (IT)', 'Sahan Narangoda.png'],
    ['Mathesha Gunarathne', 'Video Editor', 'Mathesha Gunarathne.png'],
  ];
  const teamCards = document.querySelectorAll('.team-card');

  expect(teamCards).toHaveLength(expectedMembers.length);
  expect(Array.from(teamCards, (card) => card.querySelector('h3').textContent)).toEqual(expectedMembers.map(([name]) => name));
  expectedMembers.forEach(([name, role, imageFile]) => {
    expect(screen.getByRole('heading', { name })).toBeInTheDocument();
    expect(screen.getByText(role)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: `Portrait of ${name}` })).toHaveAttribute('src', imageFile);
  });
  expect(new Set(Array.from(document.querySelectorAll('.team-card img'), (image) => image.getAttribute('src'))).size).toBe(9);
  expect(mainNavigation.queryByRole('link', { name: 'Process' })).not.toBeInTheDocument();
  expect(document.querySelector('.mobile-nav a[href="/process"]')).toBeNull();
  expect(document.querySelector('.site-header .wordmark img')).toHaveAttribute('src', 'Logonew.png');
  expect(document.querySelector('.site-header .wordmark img')).toHaveAttribute('alt', 'CANMABiz');
});

test('opens the mobile menu and closes it after route selection', async () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));
  expect(screen.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true');

  const mobileNavigation = within(screen.getByRole('navigation', { name: 'Mobile navigation' }));
  fireEvent.click(mobileNavigation.getByRole('link', { name: /our team/i }));
  expect(await screen.findByRole('heading', { name: /meet the people/i })).toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute('aria-expanded', 'false'));
});

test('filters portfolio references and shows all five Knowledge Hub videos', () => {
  const { container } = render(<App />);
  const mainNavigation = within(screen.getByRole('navigation', { name: 'Main navigation' }));

  fireEvent.click(mainNavigation.getByRole('link', { name: 'Portfolio' }));
  fireEvent.click(screen.getByRole('button', { name: 'Travel & Tourism' }));
  expect(container.querySelectorAll('.portfolio-card')).toHaveLength(1);
  expect(screen.getByRole('heading', { name: 'Angels Travels' })).toBeInTheDocument();

  fireEvent.click(mainNavigation.getByRole('link', { name: 'Knowledge Hub' }));
  expect(screen.getByRole('heading', { name: /ideas to move business forward/i })).toBeInTheDocument();
  expect(screen.getByText('Home / Knowledge Hub')).toBeInTheDocument();
  expect(document.querySelector('.knowledge-library')).toBeInTheDocument();
  expect(container.querySelectorAll('.knowledge-video-card')).toHaveLength(5);
  expect(container.querySelector('.knowledge-video-grid')).not.toHaveTextContent(/CANMABiz video|Video 0[1-5]/i);
  expect(container.querySelectorAll('.knowledge-video-copy')).toHaveLength(0);
  expect(Array.from(container.querySelectorAll('.knowledge-video-thumbnail img'), (image) => image.getAttribute('src'))).toEqual([
    'https://img.youtube.com/vi/N1heT-v_eIQ/hqdefault.jpg',
    'https://img.youtube.com/vi/kOCnf_QChg0/hqdefault.jpg',
    'https://img.youtube.com/vi/wm8WsRaKFvU/hqdefault.jpg',
    'https://img.youtube.com/vi/vKlkeL2F3ow/hqdefault.jpg',
    'https://img.youtube.com/vi/yF-kTYBY_eY/hqdefault.jpg',
  ]);
});

test('plays the selected video in an accessible modal and stops it on Escape', () => {
  render(<App />);
  fireEvent.click(within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('link', { name: 'Knowledge Hub' }));

  const videoButton = screen.getByRole('button', { name: 'Play Knowledge Hub video 3' });
  videoButton.focus();
  fireEvent.click(videoButton);

  const modal = screen.getByRole('dialog', { name: 'Knowledge Hub video' });
  expect(modal).toHaveAttribute('aria-modal', 'true');
  expect(modal.querySelector('iframe')).toHaveAttribute(
    'src',
    'https://www.youtube-nocookie.com/embed/wm8WsRaKFvU?autoplay=1&playsinline=1&rel=0',
  );
  expect(document.body).toHaveStyle({ overflow: 'hidden' });
  expect(screen.getByRole('link', { name: /open original video on youtube/i })).toHaveAttribute(
    'href',
    'https://youtu.be/wm8WsRaKFvU?si=VUxbYT-mx9i98sK-',
  );

  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(document.querySelector('iframe')).not.toBeInTheDocument();
  expect(document.body.style.overflow).toBe('');
  expect(document.activeElement).toBe(videoButton);
});

test('keeps every supplied YouTube URL paired with its matching embedded video ID', () => {
  render(<App />);
  fireEvent.click(within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('link', { name: 'Knowledge Hub' }));

  const videos = [
    ['N1heT-v_eIQ', 'https://youtu.be/N1heT-v_eIQ?si=-Vb6xbEyAj6zUMmm'],
    ['kOCnf_QChg0', 'https://youtu.be/kOCnf_QChg0?si=HOfe4e8Fl3zpt-9i'],
    ['wm8WsRaKFvU', 'https://youtu.be/wm8WsRaKFvU?si=VUxbYT-mx9i98sK-'],
    ['vKlkeL2F3ow', 'https://youtu.be/vKlkeL2F3ow?si=oi91E8ZBFNwedAuQ'],
    ['yF-kTYBY_eY', 'https://youtu.be/yF-kTYBY_eY?si=g_JSaex2pATEAFkZ'],
  ];

  videos.forEach(([id, youtubeUrl], index) => {
    fireEvent.click(screen.getByRole('button', { name: `Play Knowledge Hub video ${index + 1}` }));
    const modal = screen.getByRole('dialog');
    expect(modal.querySelector('iframe')).toHaveAttribute(
      'src',
      `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`,
    );
    expect(within(modal).getByRole('link', { name: /open original video on youtube/i })).toHaveAttribute('href', youtubeUrl);
    fireEvent.keyDown(window, { key: 'Escape' });
  });
});

test('uses an official alternate thumbnail when a video thumbnail is unavailable', () => {
  render(<App />);
  fireEvent.click(within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('link', { name: 'Knowledge Hub' }));
  const image = screen.getAllByRole('button', { name: /^play/i })[0].querySelector('img');

  fireEvent.error(image);
  expect(image).toHaveAttribute('src', 'https://img.youtube.com/vi/N1heT-v_eIQ/0.jpg');
  fireEvent.error(image);
  expect(image).not.toBeInTheDocument();
});

test('shows the supplied service overview and grouped digital marketing offerings', () => {
  render(<App />);
  const mainNavigation = within(screen.getByRole('navigation', { name: 'Main navigation' }));
  fireEvent.click(mainNavigation.getByRole('link', { name: 'Services' }));

  expect(screen.getByRole('heading', { name: 'What We Do' })).toBeInTheDocument();
  expect(screen.getByText(/end-to-end business solutions that empower organizations/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Social Media Management' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Digital Advertising' })).toBeInTheDocument();
  expect(screen.getByText('SOP (Standard Operating Procedure) System Development')).toBeInTheDocument();
  expect(screen.getByText('Meta (Facebook & Instagram) Advertising')).toBeInTheDocument();
  expect(screen.getByText('Website Maintenance & Updates')).toBeInTheDocument();
  expect(screen.getByText('Social Media Reel Production')).toBeInTheDocument();
});

test('shows the supplied company overview, capabilities, client count, and industries on About', () => {
  render(<App />);
  const mainNavigation = within(screen.getByRole('navigation', { name: 'Main navigation' }));
  fireEvent.click(mainNavigation.getByRole('link', { name: 'About' }));

  expect(screen.getByRole('heading', { name: /business solutions\. built for growth\./i })).toBeInTheDocument();
  expect(screen.getByText(/more than 20 clients trust canmabiz/i)).toBeInTheDocument();
  expect(screen.getByText('20+')).toBeInTheDocument();
  expect(screen.getByText('Business Funding Guidance')).toBeInTheDocument();
  expect(screen.getByText('SOP System Development')).toBeInTheDocument();
  expect(screen.getByText('Eco Tourism')).toBeInTheDocument();
  expect(screen.getByText('Gems & Jewellery')).toBeInTheDocument();
});

test('shows the supplied Why Us principles and comparison, and omits Industries from the footer', () => {
  render(<App />);
  const mainNavigation = within(screen.getByRole('navigation', { name: 'Main navigation' }));
  fireEvent.click(mainNavigation.getByRole('link', { name: 'Why Us' }));

  expect(screen.getByRole('heading', { name: 'Why Businesses Choose Us' })).toBeInTheDocument();
  expect(screen.getByText('The CANMA-Biz Difference')).toBeInTheDocument();
  expect(screen.getByText(/we don't just consult — we partner/i)).toBeInTheDocument();
  expect(screen.getByText('Home / Why Us')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Trust' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Process' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Expertise' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Confidentiality' })).toBeInTheDocument();
  expect(screen.getByRole('table', { name: 'CANMA-Biz compared with a typical firm' })).toBeInTheDocument();
  expect(screen.getByText('3–5 business days')).toBeInTheDocument();
  expect(within(screen.getByRole('contentinfo')).queryByRole('link', { name: 'Industries' })).not.toBeInTheDocument();
});
