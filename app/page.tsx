import CGPA from "@/components/Cgpa";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <section className=" " id="home">
        <CGPA />
      </section>
    
      <section className="sm:px-16 px-8 py-5 bg-gray-800" id="footer">
        <Footer />
      </section>
    </>
  );
}
