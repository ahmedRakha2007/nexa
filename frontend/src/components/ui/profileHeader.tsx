import { User } from "@/types";
import { UserAvatar } from "../common/UserAvatar";

interface ProfileHeaderProps {
  profile: {
    display_name: string;
    username: string;
    profile_picture_url: string;
    bio: string;
    posts_count: number;
    friends_count: number;
  };
}

function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { posts_count, friends_count } = profile;

  return (
    <div className="mb-8">
      {/* Main profile information */}
      <div className="flex items-start gap-4">
        <UserAvatar user={profile} size="lg" />

        <div className="min-w-0 flex-1">
          {/* Display name */}
          <h1 className="text-2xl font-bold">{profile.display_name || profile.username}</h1>

          {/* Username */}
          <p className="text-sm text-muted-foreground">@{profile.username}</p>

          {/* Bio */}
          {profile.bio && <p className="mt-2 max-w-lg text-sm text-gray-600">{profile.bio}</p>}
        </div>
      </div>

      {/* Profile statistics */}
      <div className="mt-6 flex gap-6">
        <div>
          <p className="text-lg font-semibold">{posts_count}</p>
          <p className="text-sm text-muted-foreground">Posts</p>
        </div>

        <div>
          <p className="text-lg font-semibold">{friends_count}</p>
          <p className="text-sm text-muted-foreground">Friends</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
