import { useLogin } from "./useLogin";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginUser } from "./loginSlice";
import toast from "react-hot-toast";
import styles from "./Login.module.css";

function Login() {
  const { login, isLoading } = useLogin();
  const { register, handleSubmit, reset, formState } = useForm({
    mode: "onTouched",
  });
  const { errors } = formState;
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  function onError(errors) {
    if (errors.message) {
      const firstTwoWords = errors.message.split(" ").slice(0, 3).join(" ");
      toast.error(firstTwoWords, { id: "loginToast" });
    }
  }

  function onSubmit(data) {
    if (!data.email || !data.password) return;
    login(data, {
      onSuccess: (response) => {
        reset();
        queryClient.invalidateQueries({ queryKey: ["token"] });
        dispatch(loginUser(response));
        toast.dismiss("loginToast");
        toast.success("login successful", { id: "loginSuccess" });
      },
      onError: (error) => {
        //console.log(error.message);
        onError(error);
      },
    });
  }
  return (
    <>
      <div className={styles.container}>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className={styles.form}
        >
          <h2>Login</h2>

          <label>
            Email:
            <input
              type="email"
              {...register("email", { required: "email is required" })}
            />
            {errors.email && (
              <p className={styles.error}>{errors?.email?.message}</p>
            )}
          </label>

          <label>
            Password:
            <input
              type="password"
              {...register("password", { required: "password is required" })}
            />
            {errors.password && (
              <div>
                <p className={styles.error}>{errors?.password?.message}</p>
              </div>
            )}
          </label>
          {/* {errors.serverError && (
            <p className={styles.error}>{errors.serverError.message}</p>
          )} */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;

/* for deleteing a data or signing in use useMutation hook by react query
  const [isLoading:isSigningIn,mutate] = useMutation({
    mutationFn:LoginUser (func def in api file in services folder),
    onSuccess:()=>{
      toast.success("user logged in successfully");
      queryClient.invalidateQueries({
        queryKey:["users"] (cache stores while getting user should be invalidated or refetched)
      });
    },
    onError:(err)=>toast.err(err.message)
  
  })


*/
