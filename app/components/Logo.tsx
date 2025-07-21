import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex items-center justify-center">
      {/* Temporary placeholder - replace with your actual logo */}
      {/* <div className="w-48 h-32 bg-white rounded-lg flex items-center justify-center">
        <div className="text-black text-2xl font-bold text-center">
          TRIFECTA<br />
          COLLECTIONS
        </div>
      </div> */}
      
      {/* Uncomment this when you have your logo: */}
      <Image
        className='w-full'
        src="/images/trifecta-logo.jpg"
        alt="Trifecta Collections Logo"
        width={200}
        height={100}
        priority
      />
     
    </div>
  );
}
