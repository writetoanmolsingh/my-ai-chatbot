import aiLogo from './assets/my-ai-bot.png';
 
const Navbar = () => {
 const handleHomeClick = (e) => {
   e.preventDefault();
   // Replace this with actual releaseLock() if needed
   window.location.href = "/home";
 };
 return (
<div className="w-full bg-blue-900 text-white shadow-md px-4 py-2 flex flex-wrap items-center justify-between">
     {/* Logo */}
<a onClick={handleHomeClick} href="/home" className="flex items-center cursor-pointer">
<img
         src={aiLogo}
         alt="AI Logo"
         width="150"
         height="50"
         className="object-contain"
       />
</a>
<div className="flex items-center space-x-2 mt-2 md:mt-0">
</div>
</div>
 );
};
export default Navbar;