import { Tab } from '@headlessui/react';
import useSWR from 'swr';
import TabRoom from '@/features/simulataneousStay/TabRoom';
import GanttStayLog from '@/types/ganttStayLog';
import { baseURL } from '@/utils/endpoint';

// @ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

type Props = {
  id: string;
};

export default function TabDate(props: Props) {
  const { data, error } = useSWR<GanttStayLog[]>(
    `${baseURL}/room/v1/list/simultaneous/${props.id}`,
  );
  if (data !== null) {
    // データがまだない場合は読み込み中のUIを表示する
  }
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div className='max-w-md  pt-8 sm:px-0'>
      <Tab.Group>
        <Tab.List className='flex space-x-1 rounded-xl bg-blue-900/20 p-1'>
          {data.map((item) => {
            return (
              <Tab
                key={item.id}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white shadow'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
                  )
                }
              >
                {item.date}
              </Tab>
            );
          })}
        </Tab.List>
        <Tab.Panels className=' w-[1240px] '>
          {data.map((item) => (
            <Tab.Panel key={item.id}>
              <TabRoom rooms={item.rooms} key={item.id} />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
