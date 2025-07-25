import { Select } from '@mantine/core';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import TabDate from '@/features/simulataneousStay/TabDate';
import { User } from '@/types/user';
import { baseURL } from '@/utils/endpoint';

type selectUser = {
  value: string;
  label: string;
};

type SimultaneousStayUserGetResponse = {
  date: string;
  names: Name[];
};
type Name = {
  name: string;
  id: number;
};

const SimulataneousStay = () => {
  const { data: users, error } = useSWR<User[]>(`${baseURL}/user/v1/list`);
  const [selectUsers, setSelectUsers] = useState<selectUser[]>([]);
  const [SimultaneousStayUser, setSimultaneousStayUser] = useState<
    SimultaneousStayUserGetResponse[]
  >([]);
  const [userID, setUserID] = useState('');

  useEffect(() => {
    if (users) {
      const userList: selectUser[] = users.map((user) => {
        return {
          label: user.name,
          value: `${user.id}`,
        };
      });
      setSelectUsers([...userList]);
    }
  }, [users]);

  if (error) return <div>failed to load</div>;
  if (!users) {
    return <div>loading...</div>;
  }

  const getSimultaneousUserList = async (userId: string) => {
    const data = await fetch(`${baseURL}/user/v1/list/simultaneous/${userId}`);
    setSimultaneousStayUser(await data.json());
  };

  const outPutJson = () => {
    const json = JSON.stringify(SimultaneousStayUser);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simultaneousStayUser.json';
    a.click();
  };

  return (
    <div>
      <div className='mx-auto mt-10 flex w-1/2 flex-col items-center justify-start  bg-blue-100'>
        <Select
          classNames={{
            label: 'md:text-2xl',
          }}
          className='mt-2'
          label='コロナ陽性者を選択してください'
          placeholder='ユーザを選択'
          searchable
          nothingFoundMessage='No options'
          data={selectUsers}
          onChange={(e) => {
            if (e !== null) {
              getSimultaneousUserList(e);
              setUserID(e);
            }
          }}
        />
        {/* <div className="flex flex-col  mt-6 w-72 ">
          {SimultaneousStayUser.map((data, index) => {
            return (
              <div key={index} className=" ">
                {data.date}
                <div className="flex gap-2 ">
                  {data.names.map((name) => (
                    <div key={name.id}>{name.name}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div> */}
        <button
          className='mt-8 rounded bg-blue-500 px-2 py-1 font-bold text-white hover:bg-blue-400 md:px-4 md:py-2'
          onClick={outPutJson}
        >
          JSON出力
        </button>
      </div>
      <TabDate id={userID} />
    </div>
  );
};

export default SimulataneousStay;
