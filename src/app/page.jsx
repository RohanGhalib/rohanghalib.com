import Hero from "@/sections/Hero";
import AboutMe from "@/sections/AboutMe";
export default function Home() {
  return (
   <>
   <Hero />
   <AboutMe />
   <footer className="footer mt-5">
    <div className="container">
      <div className="row mt-3 ">
        <div className="col-lg-4 mt-5">
          <img src="/logo.svg" height="200" alt="" />
        </div>
                <div className="col-lg-4"></div>

        <div className="col-lg-4 mt-5">

          <p className="text-end urdutext fs-2">
ہمیں جان دینی ہے ایک دن وہ کسی طرح وہ کہیں سہی۔
<br />ہمیں آپ کھینچے دار پر جو نہیں کوئی تو ہمیں سہی۔
            <br />
سر طور ہو سر حشر ہو ہمیں انتظار قبول ہے۔
<br />وہ کبھی ملیں وہ کہیں ملیں وہ کبھی سہی وہ کہیں سہی۔

          </p>
        </div>
      </div>
    </div>
   </footer>
   </>
  );
}
