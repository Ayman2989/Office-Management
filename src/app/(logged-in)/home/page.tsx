import ThemedCalendar from "@/components/ThemedCalender";
import Widgets from "@/components/Widgets";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { connectDB } from "@/db/config";
import Event from "@/models/Event";

const Homepage = async () => {
  const user = await getCurrentUser();
  if (!user)
    return <div className="text-center text-red-500 mt-10">Unauthorized</div>;

  await connectDB();

  const events = await Event.find({ assignedUsers: user._id }).select(
    "title date"
  );

  return (
    <div className="w-full flex justify-center items-center px-24">
      <ThemedCalendar events={JSON.parse(JSON.stringify(events))} />
      <Widgets />
    </div>
  );
};

export default Homepage;
