import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type UserModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>;
export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type UserMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    passwordHash: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    isActive: boolean | null;
};
export type UserMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    passwordHash: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    isActive: boolean | null;
};
export type UserCountAggregateOutputType = {
    id: number;
    email: number;
    passwordHash: number;
    createdAt: number;
    updatedAt: number;
    isActive: number;
    _all: number;
};
export type UserMinAggregateInputType = {
    id?: true;
    email?: true;
    passwordHash?: true;
    createdAt?: true;
    updatedAt?: true;
    isActive?: true;
};
export type UserMaxAggregateInputType = {
    id?: true;
    email?: true;
    passwordHash?: true;
    createdAt?: true;
    updatedAt?: true;
    isActive?: true;
};
export type UserCountAggregateInputType = {
    id?: true;
    email?: true;
    passwordHash?: true;
    createdAt?: true;
    updatedAt?: true;
    isActive?: true;
    _all?: true;
};
export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserCountAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUser[P]> : Prisma.GetScalarType<T[P], AggregateUser[P]>;
};
export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput | Prisma.UserOrderByWithAggregationInput[];
    by: Prisma.UserScalarFieldEnum[] | Prisma.UserScalarFieldEnum;
    having?: Prisma.UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type UserGroupByOutputType = {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>;
}>>;
export type UserWhereInput = {
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    id?: Prisma.StringFilter<"User"> | string;
    email?: Prisma.StringFilter<"User"> | string;
    passwordHash?: Prisma.StringFilter<"User"> | string;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    isActive?: Prisma.BoolFilter<"User"> | boolean;
    Snippets?: Prisma.SnippetListRelationFilter;
    DailySessions?: Prisma.DailySessionListRelationFilter;
    Entries?: Prisma.EntryListRelationFilter;
    StyleProfiles?: Prisma.StyleProfileListRelationFilter;
    Questions?: Prisma.QuestionListRelationFilter;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    Snippets?: Prisma.SnippetOrderByRelationAggregateInput;
    DailySessions?: Prisma.DailySessionOrderByRelationAggregateInput;
    Entries?: Prisma.EntryOrderByRelationAggregateInput;
    StyleProfiles?: Prisma.StyleProfileOrderByRelationAggregateInput;
    Questions?: Prisma.QuestionOrderByRelationAggregateInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    passwordHash?: Prisma.StringFilter<"User"> | string;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    isActive?: Prisma.BoolFilter<"User"> | boolean;
    Snippets?: Prisma.SnippetListRelationFilter;
    DailySessions?: Prisma.DailySessionListRelationFilter;
    Entries?: Prisma.EntryListRelationFilter;
    StyleProfiles?: Prisma.StyleProfileListRelationFilter;
    Questions?: Prisma.QuestionListRelationFilter;
}, "id" | "email">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    _count?: Prisma.UserCountOrderByAggregateInput;
    _max?: Prisma.UserMaxOrderByAggregateInput;
    _min?: Prisma.UserMinOrderByAggregateInput;
};
export type UserScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"User"> | string;
    email?: Prisma.StringWithAggregatesFilter<"User"> | string;
    passwordHash?: Prisma.StringWithAggregatesFilter<"User"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    isActive?: Prisma.BoolWithAggregatesFilter<"User"> | boolean;
};
export type UserCreateInput = {
    id?: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    isActive?: boolean;
    Snippets?: Prisma.SnippetCreateNestedManyWithoutUserInput;
    DailySessions?: Prisma.DailySessionCreateNestedManyWithoutUserInput;
    Entries?: Prisma.EntryCreateNestedManyWithoutUserInput;
    StyleProfiles?: Prisma.StyleProfileCreateNestedManyWithoutUserInput;
    Questions?: Prisma.QuestionCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateInput = {
    id?: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    isActive?: boolean;
    Snippets?: Prisma.SnippetUncheckedCreateNestedManyWithoutUserInput;
    DailySessions?: Prisma.DailySessionUncheckedCreateNestedManyWithoutUserInput;
    Entries?: Prisma.EntryUncheckedCreateNestedManyWithoutUserInput;
    StyleProfiles?: Prisma.StyleProfileUncheckedCreateNestedManyWithoutUserInput;
    Questions?: Prisma.QuestionUncheckedCreateNestedManyWithoutUserInput;
};
export type UserUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    Snippets?: Prisma.SnippetUpdateManyWithoutUserNestedInput;
    DailySessions?: Prisma.DailySessionUpdateManyWithoutUserNestedInput;
    Entries?: Prisma.EntryUpdateManyWithoutUserNestedInput;
    StyleProfiles?: Prisma.StyleProfileUpdateManyWithoutUserNestedInput;
    Questions?: Prisma.QuestionUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    Snippets?: Prisma.SnippetUncheckedUpdateManyWithoutUserNestedInput;
    DailySessions?: Prisma.DailySessionUncheckedUpdateManyWithoutUserNestedInput;
    Entries?: Prisma.EntryUncheckedUpdateManyWithoutUserNestedInput;
    StyleProfiles?: Prisma.StyleProfileUncheckedUpdateManyWithoutUserNestedInput;
    Questions?: Prisma.QuestionUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateManyInput = {
    id?: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    isActive?: boolean;
};
export type UserUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
};
export type UserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
};
export type UserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
};
export type UserScalarRelationFilter = {
    is?: Prisma.UserWhereInput;
    isNot?: Prisma.UserWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type UserCreateNestedOneWithoutSnippetsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSnippetsInput, Prisma.UserUncheckedCreateWithoutSnippetsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSnippetsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutSnippetsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSnippetsInput, Prisma.UserUncheckedCreateWithoutSnippetsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSnippetsInput;
    upsert?: Prisma.UserUpsertWithoutSnippetsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutSnippetsInput, Prisma.UserUpdateWithoutSnippetsInput>, Prisma.UserUncheckedUpdateWithoutSnippetsInput>;
};
export type UserCreateNestedOneWithoutDailySessionsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutDailySessionsInput, Prisma.UserUncheckedCreateWithoutDailySessionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutDailySessionsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutDailySessionsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutDailySessionsInput, Prisma.UserUncheckedCreateWithoutDailySessionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutDailySessionsInput;
    upsert?: Prisma.UserUpsertWithoutDailySessionsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutDailySessionsInput, Prisma.UserUpdateWithoutDailySessionsInput>, Prisma.UserUncheckedUpdateWithoutDailySessionsInput>;
};
export type UserCreateNestedOneWithoutQuestionsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutQuestionsInput, Prisma.UserUncheckedCreateWithoutQuestionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutQuestionsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutQuestionsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutQuestionsInput, Prisma.UserUncheckedCreateWithoutQuestionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutQuestionsInput;
    upsert?: Prisma.UserUpsertWithoutQuestionsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutQuestionsInput, Prisma.UserUpdateWithoutQuestionsInput>, Prisma.UserUncheckedUpdateWithoutQuestionsInput>;
};
export type UserCreateNestedOneWithoutEntriesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutEntriesInput, Prisma.UserUncheckedCreateWithoutEntriesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutEntriesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutEntriesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutEntriesInput, Prisma.UserUncheckedCreateWithoutEntriesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutEntriesInput;
    upsert?: Prisma.UserUpsertWithoutEntriesInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutEntriesInput, Prisma.UserUpdateWithoutEntriesInput>, Prisma.UserUncheckedUpdateWithoutEntriesInput>;
};
export type UserCreateNestedOneWithoutStyleProfilesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutStyleProfilesInput, Prisma.UserUncheckedCreateWithoutStyleProfilesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutStyleProfilesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutStyleProfilesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutStyleProfilesInput, Prisma.UserUncheckedCreateWithoutStyleProfilesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutStyleProfilesInput;
    upsert?: Prisma.UserUpsertWithoutStyleProfilesInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutStyleProfilesInput, Prisma.UserUpdateWithoutStyleProfilesInput>, Prisma.UserUncheckedUpdateWithoutStyleProfilesInput>;
};
export type UserCreateWithoutSnippetsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    isActive?: boolean;
    DailySessions?: Prisma.DailySessionCreateNestedManyWithoutUserInput;
    Entries?: Prisma.EntryCreateNestedManyWithoutUserInput;
    StyleProfiles?: Prisma.StyleProfileCreateNestedManyWithoutUserInput;
    Questions?: Prisma.QuestionCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutSnippetsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    isActive?: boolean;
    DailySessions?: Prisma.DailySessionUncheckedCreateNestedManyWithoutUserInput;
    Entries?: Prisma.EntryUncheckedCreateNestedManyWithoutUserInput;
    StyleProfiles?: Prisma.StyleProfileUncheckedCreateNestedManyWithoutUserInput;
    Questions?: Prisma.QuestionUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutSnippetsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutSnippetsInput, Prisma.UserUncheckedCreateWithoutSnippetsInput>;
};
export type UserUpsertWithoutSnippetsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutSnippetsInput, Prisma.UserUncheckedUpdateWithoutSnippetsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutSnippetsInput, Prisma.UserUncheckedCreateWithoutSnippetsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutSnippetsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutSnippetsInput, Prisma.UserUncheckedUpdateWithoutSnippetsInput>;
};
export type UserUpdateWithoutSnippetsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    DailySessions?: Prisma.DailySessionUpdateManyWithoutUserNestedInput;
    Entries?: Prisma.EntryUpdateManyWithoutUserNestedInput;
    StyleProfiles?: Prisma.StyleProfileUpdateManyWithoutUserNestedInput;
    Questions?: Prisma.QuestionUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutSnippetsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    DailySessions?: Prisma.DailySessionUncheckedUpdateManyWithoutUserNestedInput;
    Entries?: Prisma.EntryUncheckedUpdateManyWithoutUserNestedInput;
    StyleProfiles?: Prisma.StyleProfileUncheckedUpdateManyWithoutUserNestedInput;
    Questions?: Prisma.QuestionUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutDailySessionsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    isActive?: boolean;
    Snippets?: Prisma.SnippetCreateNestedManyWithoutUserInput;
    Entries?: Prisma.EntryCreateNestedManyWithoutUserInput;
    StyleProfiles?: Prisma.StyleProfileCreateNestedManyWithoutUserInput;
    Questions?: Prisma.QuestionCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutDailySessionsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    isActive?: boolean;
    Snippets?: Prisma.SnippetUncheckedCreateNestedManyWithoutUserInput;
    Entries?: Prisma.EntryUncheckedCreateNestedManyWithoutUserInput;
    StyleProfiles?: Prisma.StyleProfileUncheckedCreateNestedManyWithoutUserInput;
    Questions?: Prisma.QuestionUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutDailySessionsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutDailySessionsInput, Prisma.UserUncheckedCreateWithoutDailySessionsInput>;
};
export type UserUpsertWithoutDailySessionsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutDailySessionsInput, Prisma.UserUncheckedUpdateWithoutDailySessionsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutDailySessionsInput, Prisma.UserUncheckedCreateWithoutDailySessionsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutDailySessionsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutDailySessionsInput, Prisma.UserUncheckedUpdateWithoutDailySessionsInput>;
};
export type UserUpdateWithoutDailySessionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    Snippets?: Prisma.SnippetUpdateManyWithoutUserNestedInput;
    Entries?: Prisma.EntryUpdateManyWithoutUserNestedInput;
    StyleProfiles?: Prisma.StyleProfileUpdateManyWithoutUserNestedInput;
    Questions?: Prisma.QuestionUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutDailySessionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    Snippets?: Prisma.SnippetUncheckedUpdateManyWithoutUserNestedInput;
    Entries?: Prisma.EntryUncheckedUpdateManyWithoutUserNestedInput;
    StyleProfiles?: Prisma.StyleProfileUncheckedUpdateManyWithoutUserNestedInput;
    Questions?: Prisma.QuestionUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutQuestionsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    isActive?: boolean;
    Snippets?: Prisma.SnippetCreateNestedManyWithoutUserInput;
    DailySessions?: Prisma.DailySessionCreateNestedManyWithoutUserInput;
    Entries?: Prisma.EntryCreateNestedManyWithoutUserInput;
    StyleProfiles?: Prisma.StyleProfileCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutQuestionsInput = {
    id?: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    isActive?: boolean;
    Snippets?: Prisma.SnippetUncheckedCreateNestedManyWithoutUserInput;
    DailySessions?: Prisma.DailySessionUncheckedCreateNestedManyWithoutUserInput;
    Entries?: Prisma.EntryUncheckedCreateNestedManyWithoutUserInput;
    StyleProfiles?: Prisma.StyleProfileUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutQuestionsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutQuestionsInput, Prisma.UserUncheckedCreateWithoutQuestionsInput>;
};
export type UserUpsertWithoutQuestionsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutQuestionsInput, Prisma.UserUncheckedUpdateWithoutQuestionsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutQuestionsInput, Prisma.UserUncheckedCreateWithoutQuestionsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutQuestionsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutQuestionsInput, Prisma.UserUncheckedUpdateWithoutQuestionsInput>;
};
export type UserUpdateWithoutQuestionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    Snippets?: Prisma.SnippetUpdateManyWithoutUserNestedInput;
    DailySessions?: Prisma.DailySessionUpdateManyWithoutUserNestedInput;
    Entries?: Prisma.EntryUpdateManyWithoutUserNestedInput;
    StyleProfiles?: Prisma.StyleProfileUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutQuestionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    Snippets?: Prisma.SnippetUncheckedUpdateManyWithoutUserNestedInput;
    DailySessions?: Prisma.DailySessionUncheckedUpdateManyWithoutUserNestedInput;
    Entries?: Prisma.EntryUncheckedUpdateManyWithoutUserNestedInput;
    StyleProfiles?: Prisma.StyleProfileUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutEntriesInput = {
    id?: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    isActive?: boolean;
    Snippets?: Prisma.SnippetCreateNestedManyWithoutUserInput;
    DailySessions?: Prisma.DailySessionCreateNestedManyWithoutUserInput;
    StyleProfiles?: Prisma.StyleProfileCreateNestedManyWithoutUserInput;
    Questions?: Prisma.QuestionCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutEntriesInput = {
    id?: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    isActive?: boolean;
    Snippets?: Prisma.SnippetUncheckedCreateNestedManyWithoutUserInput;
    DailySessions?: Prisma.DailySessionUncheckedCreateNestedManyWithoutUserInput;
    StyleProfiles?: Prisma.StyleProfileUncheckedCreateNestedManyWithoutUserInput;
    Questions?: Prisma.QuestionUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutEntriesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutEntriesInput, Prisma.UserUncheckedCreateWithoutEntriesInput>;
};
export type UserUpsertWithoutEntriesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutEntriesInput, Prisma.UserUncheckedUpdateWithoutEntriesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutEntriesInput, Prisma.UserUncheckedCreateWithoutEntriesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutEntriesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutEntriesInput, Prisma.UserUncheckedUpdateWithoutEntriesInput>;
};
export type UserUpdateWithoutEntriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    Snippets?: Prisma.SnippetUpdateManyWithoutUserNestedInput;
    DailySessions?: Prisma.DailySessionUpdateManyWithoutUserNestedInput;
    StyleProfiles?: Prisma.StyleProfileUpdateManyWithoutUserNestedInput;
    Questions?: Prisma.QuestionUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutEntriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    Snippets?: Prisma.SnippetUncheckedUpdateManyWithoutUserNestedInput;
    DailySessions?: Prisma.DailySessionUncheckedUpdateManyWithoutUserNestedInput;
    StyleProfiles?: Prisma.StyleProfileUncheckedUpdateManyWithoutUserNestedInput;
    Questions?: Prisma.QuestionUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutStyleProfilesInput = {
    id?: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    isActive?: boolean;
    Snippets?: Prisma.SnippetCreateNestedManyWithoutUserInput;
    DailySessions?: Prisma.DailySessionCreateNestedManyWithoutUserInput;
    Entries?: Prisma.EntryCreateNestedManyWithoutUserInput;
    Questions?: Prisma.QuestionCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutStyleProfilesInput = {
    id?: string;
    email: string;
    passwordHash: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    isActive?: boolean;
    Snippets?: Prisma.SnippetUncheckedCreateNestedManyWithoutUserInput;
    DailySessions?: Prisma.DailySessionUncheckedCreateNestedManyWithoutUserInput;
    Entries?: Prisma.EntryUncheckedCreateNestedManyWithoutUserInput;
    Questions?: Prisma.QuestionUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutStyleProfilesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutStyleProfilesInput, Prisma.UserUncheckedCreateWithoutStyleProfilesInput>;
};
export type UserUpsertWithoutStyleProfilesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutStyleProfilesInput, Prisma.UserUncheckedUpdateWithoutStyleProfilesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutStyleProfilesInput, Prisma.UserUncheckedCreateWithoutStyleProfilesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutStyleProfilesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutStyleProfilesInput, Prisma.UserUncheckedUpdateWithoutStyleProfilesInput>;
};
export type UserUpdateWithoutStyleProfilesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    Snippets?: Prisma.SnippetUpdateManyWithoutUserNestedInput;
    DailySessions?: Prisma.DailySessionUpdateManyWithoutUserNestedInput;
    Entries?: Prisma.EntryUpdateManyWithoutUserNestedInput;
    Questions?: Prisma.QuestionUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutStyleProfilesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    Snippets?: Prisma.SnippetUncheckedUpdateManyWithoutUserNestedInput;
    DailySessions?: Prisma.DailySessionUncheckedUpdateManyWithoutUserNestedInput;
    Entries?: Prisma.EntryUncheckedUpdateManyWithoutUserNestedInput;
    Questions?: Prisma.QuestionUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCountOutputType = {
    Snippets: number;
    DailySessions: number;
    Entries: number;
    StyleProfiles: number;
    Questions: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    Snippets?: boolean | UserCountOutputTypeCountSnippetsArgs;
    DailySessions?: boolean | UserCountOutputTypeCountDailySessionsArgs;
    Entries?: boolean | UserCountOutputTypeCountEntriesArgs;
    StyleProfiles?: boolean | UserCountOutputTypeCountStyleProfilesArgs;
    Questions?: boolean | UserCountOutputTypeCountQuestionsArgs;
};
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null;
};
export type UserCountOutputTypeCountSnippetsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SnippetWhereInput;
};
export type UserCountOutputTypeCountDailySessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DailySessionWhereInput;
};
export type UserCountOutputTypeCountEntriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EntryWhereInput;
};
export type UserCountOutputTypeCountStyleProfilesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StyleProfileWhereInput;
};
export type UserCountOutputTypeCountQuestionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestionWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    isActive?: boolean;
    Snippets?: boolean | Prisma.User$SnippetsArgs<ExtArgs>;
    DailySessions?: boolean | Prisma.User$DailySessionsArgs<ExtArgs>;
    Entries?: boolean | Prisma.User$EntriesArgs<ExtArgs>;
    StyleProfiles?: boolean | Prisma.User$StyleProfilesArgs<ExtArgs>;
    Questions?: boolean | Prisma.User$QuestionsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    isActive?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    isActive?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    isActive?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "email" | "passwordHash" | "createdAt" | "updatedAt" | "isActive", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    Snippets?: boolean | Prisma.User$SnippetsArgs<ExtArgs>;
    DailySessions?: boolean | Prisma.User$DailySessionsArgs<ExtArgs>;
    Entries?: boolean | Prisma.User$EntriesArgs<ExtArgs>;
    StyleProfiles?: boolean | Prisma.User$StyleProfilesArgs<ExtArgs>;
    Questions?: boolean | Prisma.User$QuestionsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
};
export type UserIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type UserIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User";
    objects: {
        Snippets: Prisma.$SnippetPayload<ExtArgs>[];
        DailySessions: Prisma.$DailySessionPayload<ExtArgs>[];
        Entries: Prisma.$EntryPayload<ExtArgs>[];
        StyleProfiles: Prisma.$StyleProfilePayload<ExtArgs>[];
        Questions: Prisma.$QuestionPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        email: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
    }, ExtArgs["result"]["user"]>;
    composites: {};
};
export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>;
export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
};
export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['User'];
        meta: {
            name: 'User';
        };
    };
    findUnique<T extends UserFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserFindManyArgs>(args?: Prisma.SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserCreateArgs>(args: Prisma.SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserDeleteArgs>(args: Prisma.SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserUpdateArgs>(args: Prisma.SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserUpdateManyArgs>(args: Prisma.SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserUpsertArgs>(args: Prisma.SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserCountArgs>(args?: Prisma.Subset<T, UserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCountAggregateOutputType> : number>;
    aggregate<T extends UserAggregateArgs>(args: Prisma.Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>;
    groupBy<T extends UserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserGroupByArgs['orderBy'];
    } : {
        orderBy?: UserGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserFieldRefs;
}
export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    Snippets<T extends Prisma.User$SnippetsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$SnippetsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    DailySessions<T extends Prisma.User$DailySessionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$DailySessionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    Entries<T extends Prisma.User$EntriesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$EntriesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    StyleProfiles<T extends Prisma.User$StyleProfilesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$StyleProfilesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    Questions<T extends Prisma.User$QuestionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$QuestionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'String'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly passwordHash: Prisma.FieldRef<"User", 'String'>;
    readonly createdAt: Prisma.FieldRef<"User", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"User", 'DateTime'>;
    readonly isActive: Prisma.FieldRef<"User", 'Boolean'>;
}
export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
};
export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
    where: Prisma.UserWhereUniqueInput;
};
export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
};
export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type User$SnippetsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SnippetSelect<ExtArgs> | null;
    omit?: Prisma.SnippetOmit<ExtArgs> | null;
    include?: Prisma.SnippetInclude<ExtArgs> | null;
    where?: Prisma.SnippetWhereInput;
    orderBy?: Prisma.SnippetOrderByWithRelationInput | Prisma.SnippetOrderByWithRelationInput[];
    cursor?: Prisma.SnippetWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SnippetScalarFieldEnum | Prisma.SnippetScalarFieldEnum[];
};
export type User$DailySessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DailySessionSelect<ExtArgs> | null;
    omit?: Prisma.DailySessionOmit<ExtArgs> | null;
    include?: Prisma.DailySessionInclude<ExtArgs> | null;
    where?: Prisma.DailySessionWhereInput;
    orderBy?: Prisma.DailySessionOrderByWithRelationInput | Prisma.DailySessionOrderByWithRelationInput[];
    cursor?: Prisma.DailySessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DailySessionScalarFieldEnum | Prisma.DailySessionScalarFieldEnum[];
};
export type User$EntriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntrySelect<ExtArgs> | null;
    omit?: Prisma.EntryOmit<ExtArgs> | null;
    include?: Prisma.EntryInclude<ExtArgs> | null;
    where?: Prisma.EntryWhereInput;
    orderBy?: Prisma.EntryOrderByWithRelationInput | Prisma.EntryOrderByWithRelationInput[];
    cursor?: Prisma.EntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EntryScalarFieldEnum | Prisma.EntryScalarFieldEnum[];
};
export type User$StyleProfilesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StyleProfileSelect<ExtArgs> | null;
    omit?: Prisma.StyleProfileOmit<ExtArgs> | null;
    include?: Prisma.StyleProfileInclude<ExtArgs> | null;
    where?: Prisma.StyleProfileWhereInput;
    orderBy?: Prisma.StyleProfileOrderByWithRelationInput | Prisma.StyleProfileOrderByWithRelationInput[];
    cursor?: Prisma.StyleProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StyleProfileScalarFieldEnum | Prisma.StyleProfileScalarFieldEnum[];
};
export type User$QuestionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where?: Prisma.QuestionWhereInput;
    orderBy?: Prisma.QuestionOrderByWithRelationInput | Prisma.QuestionOrderByWithRelationInput[];
    cursor?: Prisma.QuestionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.QuestionScalarFieldEnum | Prisma.QuestionScalarFieldEnum[];
};
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
};
