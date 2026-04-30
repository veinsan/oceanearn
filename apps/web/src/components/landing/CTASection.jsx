function AnchorDecor() {
  return (
    <svg width="282" height="336" viewBox="0 0 336 352" fill="none" aria-hidden
      style={{ opacity: 0.15 }}>
      <path d="M142 343.2C124.933 337.333 109.467 329.333 95.6 319.2C81.7333 309.067 70.336 297.2 61.408 283.6C52.48 270 48.0107 255.467 48 240V208C48 204.8 49.4667 202.4 52.4 200.8C55.3333 199.2 58.1333 199.467 60.8 201.6L97.2 228.8C100.933 231.733 102.997 235.669 103.392 240.608C103.787 245.547 102.256 249.744 98.8 253.2L87.2 264.8C94.9333 278.4 107.2 290.133 124 300C140.8 309.867 158.133 316.133 176 318.8V176H144C139.467 176 135.669 174.464 132.608 171.392C129.547 168.32 128.011 164.523 128 160C127.989 155.477 129.525 151.68 132.608 148.608C135.691 145.536 139.488 144 144 144H176V125.2C166.667 121.733 159.003 115.931 153.008 107.792C147.013 99.6533 144.011 90.3893 144 80C144 66.6667 148.667 55.3333 158 46C167.333 36.6667 178.667 32 192 32C205.333 32 216.667 36.6667 226 46C235.333 55.3333 240 66.6667 240 80C240 90.4 237.003 99.6693 231.008 107.808C225.013 115.947 217.344 121.744 208 125.2V144H240C244.533 144 248.336 145.536 251.408 148.608C254.48 151.68 256.011 155.477 256 160C255.989 164.523 254.453 168.325 251.392 171.408C248.331 174.491 244.533 176.021 240 176H208V318.8C225.867 316.133 243.2 309.867 260 300C276.8 290.133 289.067 278.4 296.8 264.8L285.2 253.2C281.733 249.733 280.197 245.536 280.592 240.608C280.987 235.68 283.056 231.744 286.8 228.8L323.2 201.6C325.867 199.467 328.667 199.2 331.6 200.8C334.533 202.4 336 204.8 336 208V240C336 255.467 331.531 270 322.592 283.6C313.653 297.2 302.256 309.067 288.4 319.2C274.544 329.333 259.077 337.333 242 343.2C224.923 349.067 208.256 352 192 352C175.744 352 159.077 349.067 142 343.2ZM192 96C196.533 96 200.336 94.4693 203.408 91.408C206.48 88.3467 208.011 84.544 208 80C207.989 75.456 206.453 71.6587 203.392 68.608C200.331 65.5573 196.533 64.0213 192 64C187.467 63.9787 183.669 65.5147 180.608 68.608C177.547 71.7013 176.011 75.4987 176 80C175.989 84.5013 177.525 88.304 180.608 91.408C183.691 94.512 187.488 96.0427 192 96Z" fill="white"/>
    </svg>
  );
}

function TrashDecor() {
  return (
    <svg width="281" height="314" viewBox="0 0 304 336" fill="none" aria-hidden
      style={{ opacity: 0.15 }}>
      <path d="M304 64H248L232 48H152L136 64H80V96H304M96 304C96 312.487 99.3714 320.626 105.373 326.627C111.374 332.629 119.513 336 128 336H256C264.487 336 272.626 332.629 278.627 326.627C284.629 320.626 288 312.487 288 304V112H96V304Z" fill="white"/>
    </svg>
  );
}

export default function CTASection() {
  return (
    <section className="w-full bg-white py-[80px]">
      <div style={{
        maxWidth: '1920px', margin: '0 auto',
        paddingLeft: '64px', paddingRight: '64px',
        display: 'flex', gap: '24px',
      }}>
        <div style={{
          flex: 1, borderRadius: '20px', overflow: 'hidden', position: 'relative',
          background: 'linear-gradient(283deg, var(--darkBlue-800) 0.6%, var(--blue-545) 100%)',
          boxShadow: '0 4px 4px rgba(0,0,0,0.25)', padding: '43px 30px', minHeight: '430px',
        }}>
          <div style={{ position: 'absolute', right: 0, bottom: 0, pointerEvents: 'none' }}>
            <AnchorDecor />
          </div>
          <h3 className="font-body font-semibold text-orange-500"
            style={{ fontSize: '40px', lineHeight: 1, margin: '0 0 24px', maxWidth: '514px' }}>
            Bergabung Sebagai Nelayan
          </h3>
          <p className="font-ui text-white"
            style={{ fontSize: '20px', lineHeight: '30px', margin: '0 0 64px', maxWidth: '580px' }}>
            Jadilah pahlawan lautan sekaligus tingkatkan penghasilan harianmu! Kumpulkan sampah saat melaut, pindai, dan setorkan ke TPS mitra terdekat. Dapatkan koin untuk setiap kilogram sampah yang berhasil divalidasi, dan tukarkan dengan sembako, perlengkapan, hingga saldo digital.
          </p>
          <button className="cursor-pointer font-ui font-bold text-darkBlue-800"
            style={{
              fontSize: '20px', lineHeight: '40px', padding: '0 20px',
              borderRadius: '20px', border: 'none',
              background: 'rgba(217,121,37,0.85)',
              boxShadow: '0 4px 4px rgba(0,0,0,0.25)',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(217,121,37,0.6)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 4px rgba(0,0,0,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            Daftar Nelayan
          </button>
        </div>

        <div style={{
          flex: 1, borderRadius: '20px', overflow: 'hidden', position: 'relative',
          background: 'linear-gradient(103deg, var(--orange-500) 0%, var(--orange-950) 100%)',
          boxShadow: '0 4px 4px rgba(0,0,0,0.25)', padding: '43px 30px', minHeight: '430px',
        }}>
          <div style={{ position: 'absolute', right: 0, bottom: 0, pointerEvents: 'none' }}>
            <TrashDecor />
          </div>
          <h3 className="font-body font-semibold text-darkBlue-800"
            style={{ fontSize: '40px', lineHeight: 1, margin: '0 0 24px' }}>
            Daftarkan TPS
          </h3>
          <p className="font-ui text-white"
            style={{ fontSize: '20px', lineHeight: '30px', margin: '0 0 64px', maxWidth: '580px' }}>
            Tingkatkan pasokan material daur ulang dan kembangkan operasional fasilitasmu. Dengan menjadi Mitra TPS OceanEarn, kamu akan terhubung langsung dengan jaringan nelayan di pesisir. Nikmati kemudahan validasi setoran secara digital, pantau forecast suplai sampah, dan jadilah pilar utama.
          </p>
          <button className="cursor-pointer font-ui font-bold text-orange-500"
            style={{
              fontSize: '20px', lineHeight: '40px', padding: '0 20px',
              borderRadius: '20px', border: 'none',
              background: 'rgba(2,47,105,0.85)',
              boxShadow: '0 4px 4px rgba(0,0,0,0.25)',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(2,47,105,0.6)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 4px rgba(0,0,0,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            Daftar TPS
          </button>
        </div>
      </div>
    </section>
  );
}