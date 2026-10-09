import image01 from '../Images/Work Images/Image01.jpeg';
import image02 from '../Images/Work Images/Image02.jpeg';
import image03 from '../Images/Work Images/Image03.jpeg';
import image04 from '../Images/Work Images/Image04.jpeg';
import image05 from '../Images/Work Images/Image05.jpeg';
import image06 from '../Images/Work Images/Image06.jpeg';
import image07 from '../Images/Work Images/Image07.jpeg';
import image08 from '../Images/Work Images/Image08.jpeg';
import image09 from '../Images/Work Images/Image09.jpeg';
import image10 from '../Images/Work Images/Image10.jpeg';
import image11 from '../Images/Work Images/Image11.jpeg';
import image12 from '../Images/Work Images/Image12.jpeg';
import image13 from '../Images/Work Images/Image13.jpeg';
import image14 from '../Images/Work Images/Image14.jpeg';
import image15 from '../Images/Work Images/Image15.jpeg';

export const knowledgeHubWorkImages = [
  image01, image02, image03, image04, image05,
  image06, image07, image08, image09, image10,
  image11, image12, image13, image14, image15,
].map((image, index) => ({
  image,
  label: `Work image ${String(index + 1).padStart(2, '0')}`,
}));
