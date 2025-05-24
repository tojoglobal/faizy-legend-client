import { useParams } from "react-router-dom";

const Gallery = () => {
  const { title } = useParams();

  return <div>Gallery {title}</div>;
};

export default Gallery;
