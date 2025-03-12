//import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useUser } from "../features/login/useUser";
import { useDispatch } from "react-redux";
import { setUser, logoutUser } from "../features/login/loginSlice";
import styles from "./HomePage.module.css";

function HomePage() {
  const { isLoggedIn } = useSelector((store) => store.user.isLoggedIn);

  const { refetch } = useUser(isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedIn) {
      return; // Don't refetch if not logged in
    }

    const fetchUserData = async () => {
      try {
        const response = await refetch();
        if (response.data) {
          dispatch(setUser(response.data));
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // If fetch fails, assume user is not logged in
        if (isLoggedIn) {
          dispatch(logoutUser());
        }
      }
    };

    fetchUserData();
  }, [refetch, dispatch, isLoggedIn]);

  return (
    <main className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.mainHeadingButton}>
          <div>
            <h1 className={styles.mainHeading}>Crochet Pattern Pro</h1>
            <p className={styles.subheading}>
              Design your Dreams and inspire the world
            </p>
          </div>
          <div className={styles.editorButton}>
            <button className={styles.btn}>Editor</button>
          </div>
        </div>

        <div className={styles.flexContent}>
          <div className={styles.imageSection}>
            <img
              src="landingPageDiagram (1).png"
              alt="Crochet pattern diagram"
              className={styles.patternImage}
            />
            <img
              src="landingPageDiagram (2).png"
              alt="Crocheted piece"
              className={styles.pieceImage}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
