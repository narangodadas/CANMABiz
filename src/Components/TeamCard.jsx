export default function TeamCard({ member }) {
  return (
    <article className="team-card">
      <div className="team-card-portrait">
        <img src={member.image} alt={`Portrait of ${member.name}`} loading="lazy" />
      </div>
      <div className="team-card-copy">
        <h3>{member.name}</h3>
        <p className="team-role">{member.role}</p>
      </div>
    </article>
  );
}