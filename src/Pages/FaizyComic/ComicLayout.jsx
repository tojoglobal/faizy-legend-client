import { Link, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const ComicLayout = () => {
  const axiosPublicUrl = useAxiospublic();
  const { data: comic } = useQuery({
    queryKey: ["faizy-comics"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/faizy-comic");
      return res.data?.[0];
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[BAC1C8] to-[DEE6EF] text-white p-2 lg:p-4">
      <div className="max-w-6xl mx-auto 2xl:max-w-[1360px] font-sans">
        <nav className="flex gap-6 p-2 mb-8 text-sm text-gray-300">
          <Link to="/" className="hover:text-white">
            Faizy Legend
          </Link>
          <Link to="/faizycomic/comics" className="hover:text-white">
            Comic
          </Link>
          <a
            href={comic?.shop_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            Shop
          </a>
        </nav>
        <h1 className="text-center text-xl lg:text-2xl roboto-condensed text-lime-400 font-bold mb-6">
          FAÏZY COMIC
        </h1>
        <Outlet />
      </div>
    </div>
  );
};

export default ComicLayout;
