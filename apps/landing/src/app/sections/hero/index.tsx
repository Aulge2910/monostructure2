const Hero = () => {
    return (
      <section className="w-full max-w-380 min-h-screen">
        <div className="header w-full h-30 flex items-center justify-center">
          <div className="w-full flex items-center justify-center">
            <span>Brand</span>
          </div>
          <div className="w-full flex items-center justify-end">
            <span>Login</span>
          </div>
        </div>
        <div className="body w-full min-h-screen flex items-center justify-center">
          Hero Section
        </div>
      </section>
    );
}

export default Hero;