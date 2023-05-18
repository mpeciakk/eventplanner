import { type NextPage } from "next"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"

type Inputs = {
  username: string,
  password: string,
}

const SignIn: NextPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()

  const handleLoginUser = async (data: Inputs) => {
    await signIn("credentials", {
      redirect: true,
      username: data.username,
      password: data.password,
      callbackUrl: "/",
    })
  }

  return (
    <main className="relative flex flex-col justify-center h-screen bg-white">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-lg">
        <h1 className="text-3xl font-semibold text-center text-purple-700">Event Planner</h1>

        <form className="space-y-4" onSubmit={handleSubmit(handleLoginUser)}>
          <div>
            <label className="label">
              <span className="label-text">Nazwa użytkownika</span>
            </label>
            <input type="text" placeholder="Nazwa użytkownika"
                   className="w-full input input-bordered input-primary bg-inherit"
                   {...register("username", { required: true })} />
            {errors.username && <span className="text-error">To pole jest wymagane</span>}
          </div>

          <div>
            <label className="label">
              <span className="label-text">Hasło</span>
            </label>
            <input type="password" placeholder="Hasło"
                   className="w-full input input-bordered input-primary bg-inherit"
                   {...register("password", { required: true })} />
            {errors.password && <span className="text-error">To pole jest wymagane</span>}
          </div>

          <div>
            <button type="submit" className="btn btn-primary">Login</button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default SignIn
