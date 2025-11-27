import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import api from '../components/services/api';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState<any>(null);
  const [lawsCommented, setLawsCommented] = useState([]);
  const [debates, setDebates] = useState([]);

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setProfile(res.data);
        const lawsRes = await api.get(`/users/${id}/commented-laws`);
        setLawsCommented(lawsRes.data);
        const debatesRes = await api.get(`/users/${id}/debates`);
        setDebates(debatesRes.data);
      } catch (err) {
        console.error(err);
        // Handle access denied
      }
    };
    fetchProfile();
  }, [id]);

  return (
    <div>
      {profile && <h1>{profile.realName}</h1>}
      <h2>Leis Comentadas</h2>
      {lawsCommented.map((law: any) => <div key={law._id}>{law.title}</div>)}
      <h2>Debates</h2>
      {debates.map((debate: any) => <div key={debate._id}>{debate.theme || debate.law?.title}</div>)}
    </div>
  );
};

export default Profile;