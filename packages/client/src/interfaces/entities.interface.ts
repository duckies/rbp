import { Asset as BlizzardAssetEntity } from '@server/blizzard/entities/asset.entity'
import { EntityDTO } from '@server/common/types/entity-dto'
// import { CharacterHistory as CharacterHistoryEntity } from '@server/character-history/character-history.entity'
import { FileUpload as FileUploadEntity } from '@server/file/file.entity'
import { FormCharacter as FormCharacterEntity } from '@server/form-character/form-character.entity'
import { FormComment as FormCommentEntity } from '@server/form-comment/form-comment.entity'
import { FormQuestion as FormQuestionEntity } from '@server/form-question/question.entity'
import { FormSubmission as FormSubmissionEntity } from '@server/form-submission/form-submission.entity'
import { Form as FormEntity } from '@server/form/form.entity'
import { GuildCharacter as GuildCharacterEntity } from '@server/guild-character/character.entity'
import { Post as PostEntity } from '@server/post/post.entity'
import { RaidIdentityStatus as RaidIdentityStatusEntity } from '@server/raid-identity-status/raid-identity-status.entity'
import { RaidIdentity as RaidIdentityEntity } from '@server/raid-identity/raid-identity.entity'
import { RaidNight as RaidNightEntity } from '@server/raid-night/raid-night.entity'
import { Raid as RaidEntity } from '@server/raid/raid.entity'
import { Slide as SlideEntity } from '@server/slide/slide.entity'
import { User as UserEntity } from '@server/user/user.entity'

type Post = EntityDTO<PostEntity>
type BlizzardAsset = EntityDTO<BlizzardAssetEntity>
// type CharacterHistory = EntityDTO<CharacterHistoryEntity>
type FileUpload = EntityDTO<FileUploadEntity>
type FormCharacter = EntityDTO<FormCharacterEntity>
type FormComment = EntityDTO<FormCommentEntity>
type FormQuestion = EntityDTO<FormQuestionEntity>
type FormSubmission = EntityDTO<FormSubmissionEntity>
type Form = EntityDTO<FormEntity>
type GuildCharacter = EntityDTO<GuildCharacterEntity>
type Raid = EntityDTO<RaidEntity>
type Slide = EntityDTO<SlideEntity>
type User = EntityDTO<UserEntity>
type RaidNight = EntityDTO<RaidNightEntity>
type RaidIdentity = EntityDTO<RaidIdentityEntity>
type RaidIdentityStatus = EntityDTO<RaidIdentityStatusEntity>

export {
  Post,
  BlizzardAsset,
  // CharacterHistory,
  FileUpload,
  Form,
  FormCharacter,
  FormComment,
  FormQuestion,
  FormSubmission,
  GuildCharacter,
  User,
  Raid,
  RaidNight,
  RaidIdentity,
  RaidIdentityStatus,
  Slide,
}
