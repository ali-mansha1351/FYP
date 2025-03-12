import { useForm } from "react-hook-form";
import { useState } from "react";
import DatePicker from "react-datepicker";
import styles from "./Register.module.css";
import "react-datepicker/dist/react-datepicker.css";

function Register() {
  const { register, handleSubmit, formState, trigger } = useForm({
    mode: "onTouched",
  });
  const { errors } = formState;
  const [dob, setDob] = useState();
  const [step, setStep] = useState(0);

  const totalSteps = 3;

  // Move to the next step after validating current step fields
  const handleNext = async () => {
    let fieldsToValidate = [];
    // Define which fields to validate for each step
    switch (step) {
      case 0:
        fieldsToValidate = ["name", "username", "email"];
        break;
      case 1:
        fieldsToValidate = ["skillLevel", "dateOfBirth", "gender"];
        break;
      case 2:
        fieldsToValidate = ["password", "confirmPassword"];
        break;
      default:
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  function handlePrevious() {
    if (step === 0) {
      setStep(0);
    } else {
      setStep(step - 1);
    }
  }

  return (
    <>
      <div className={styles.container}>
        <form onSubmit={handleSubmit()} className={styles.form}>
          <h2>Register!</h2>
          {step === 0 && (
            <>
              <label>
                Name:
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                />
                {errors?.name && (
                  <p className={styles.error}>{errors?.name?.message}</p>
                )}
              </label>

              <label>
                Username:
                <input
                  type="text"
                  {...register("username", {
                    required: "Username is required",
                  })}
                />
                {errors?.username && (
                  <p className={styles.error}>{errors?.username?.message}</p>
                )}
              </label>

              <label>
                Email:
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors?.email && (
                  <p className={styles.error}>{errors?.email?.message}</p>
                )}
              </label>
            </>
          )}

          {step === 1 && (
            <>
              <label>
                Skill Level:
                <select
                  {...register("skillLevel", {
                    required: "Skill Level is required",
                  })}
                >
                  <option value="">Select Skill Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                {errors?.skillLevel && (
                  <p className={styles.error}>{errors?.skillLevel?.message}</p>
                )}
              </label>

              <label>
                Date of Birth:
                <DatePicker
                  selected={dob}
                  onChange={(date) => setDob(date)}
                  {...register("dateOfBirth")}
                />
                {errors?.dateOfBirth && (
                  <p className={styles.error}>Date of Birth is required</p>
                )}
              </label>

              <label>
                Gender:
                <div className={styles.genderOptions}>
                  <label>
                    <input
                      type="radio"
                      value="male"
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="female"
                      {...register("gender")}
                    />
                    Female
                  </label>
                  <label>
                    <input type="radio" value="other" {...register("gender")} />
                    Other
                  </label>
                </div>
                {errors?.gender && (
                  <p className={styles.error}>{errors?.gender?.message}</p>
                )}
              </label>
            </>
          )}

          {step === 2 && (
            <>
              <label>
                Password:
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors?.password && (
                  <p className={styles.error}>{errors?.password?.message}</p>
                )}
              </label>

              <label>
                Confirm Password:
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                  })}
                />
                {errors?.confirmPassword && (
                  <p className={styles.error}>
                    {errors?.confirmPassword?.message}
                  </p>
                )}
              </label>

              <button
                type="submit"
                className={styles.submitButton}
                // disabled={isLoading}
              >
                Register
              </button>
            </>
          )}
          <button onClick={handleNext} className={styles.counterBtn}>
            {" "}
            next
          </button>
          <button onClick={handlePrevious} className={styles.counterBtn}>
            previous
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;

/*
using react query to handle form on submit
const {register,handleSubmit,reset} = useForm();
const queryClient = useQueryClient();
const {mutation,isLoading:isSubmitting} = useMutation({
  mutationFn:registerUser,
  onSuccess:()=>{
      toast.success("new user registered");
      queryClient.invalidateQuerires({
        queryKey:['users']
      });
      reset();
    },
    onError:(err)=>toast.error(err.message)
})


function onSubmit(data){
  mutate(data);
}
using use form hook to register user
<form onSubmit={handleSubmit(onSubmit)}>

<input type="text" id="name" {...register("name"),{
  required:"this field is required"
}}/>
</form>

*/
