import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import HomePosts from "../../components/homepost/HomePosts";
import MiniProfile from "../../components/userMiniProfile/MiniProfile";
import { getAllPosts } from "../../services/user/apiMethods";
import Header from "../../components/header/header";
import { toast } from "sonner";
import HomePostLoader from "../../components/loader/HomePostLoader";
import emptypost from "../../../public/images/userNoPost.jpg";

function HomePage() {
    const selectedUser = (state) => state.auth.user;
    const user = useSelector(selectedUser);
    const userId = user._id || "";

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef();

    const lastPostRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    useEffect(() => {
        fetchPosts(page);
    }, [page]);
    const fetchPosts = async (pageNum) => {
        try {
            setLoading(true);
            const response = await getAllPosts({ userId, page: pageNum, limit: 3 });
            const postDatas = response.data.posts || [];

            if (postDatas.length > 0) {
                setPosts((prev) => {
                    const combined = [...prev, ...postDatas];

                    // ✅ Deduplicate by _id
                    const unique = combined.filter(
                        (post, index, self) => index === self.findIndex((p) => p._id === post._id)
                    );

                    return unique;
                });

                setHasMore(response.data.hasMore ?? true);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col mr-2 lg:ml-10 w-full lg:w-[58%]">
                <div className="p-2 rounded-md bg-white dark:bg-black">
                    <Header />
                </div>

                {posts.length === 0 && !loading ? (
                    <div className="flex flex-col justify-center items-center mt-4 text-black w-full h-auto">
                        <img className="w-96" src={emptypost} alt="No posts" />
                        <p className="text-gray-500">Build your connections and share your moments.</p>
                    </div>
                ) : (
                    <div className="lg:px-10 p-4 py-4 mr-2 h-max rounded-md bg-white dark:bg-black">
                        {posts.map((post, index) => {
                            if (index === posts.length - 1) {
                                return (
                                    <div ref={lastPostRef} key={post._id || `last-${index}`}>
                                        <HomePosts post={post} fetchPosts={fetchPosts} />
                                    </div>
                                );
                            }
                            return <HomePosts key={post._id || `post-${index}`} post={post} fetchPosts={fetchPosts} />;
                        })}

                        {loading && (
                            <>
                                <HomePostLoader />
                                <HomePostLoader />
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="hidden lg:flex justify-end ">
                <MiniProfile />
            </div>
        </>
    );
}

export default HomePage;
