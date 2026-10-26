import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type DailySessionModel = runtime.Types.Result.DefaultSelection<Prisma.$DailySessionPayload>;
export type AggregateDailySession = {
    _count: DailySessionCountAggregateOutputType | null;
    _min: DailySessionMinAggregateOutputType | null;
    _max: DailySessionMaxAggregateOutputType | null;
};
export type DailySessionMinAggregateOutputType = {
    id: string | null;
    date: Date | null;
    status: string | null;
    userId: string | null;
};
export type DailySessionMaxAggregateOutputType = {
    id: string | null;
    date: Date | null;
    status: string | null;
    userId: string | null;
};
export type DailySessionCountAggregateOutputType = {
    id: number;
    date: number;
    status: number;
    userId: number;
    _all: number;
};
export type DailySessionMinAggregateInputType = {
    id?: true;
    date?: true;
    status?: true;
    userId?: true;
};
export type DailySessionMaxAggregateInputType = {
    id?: true;
    date?: true;
    status?: true;
    userId?: true;
};
export type DailySessionCountAggregateInputType = {
    id?: true;
    date?: true;
    status?: true;
    userId?: true;
    _all?: true;
};
export type DailySessionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DailySessionWhereInput;
    orderBy?: Prisma.DailySessionOrderByWithRelationInput | Prisma.DailySessionOrderByWithRelationInput[];
    cursor?: Prisma.DailySessionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DailySessionCountAggregateInputType;
    _min?: DailySessionMinAggregateInputType;
    _max?: DailySessionMaxAggregateInputType;
};
export type GetDailySessionAggregateType<T extends DailySessionAggregateArgs> = {
    [P in keyof T & keyof AggregateDailySession]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDailySession[P]> : Prisma.GetScalarType<T[P], AggregateDailySession[P]>;
};
export type DailySessionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DailySessionWhereInput;
    orderBy?: Prisma.DailySessionOrderByWithAggregationInput | Prisma.DailySessionOrderByWithAggregationInput[];
    by: Prisma.DailySessionScalarFieldEnum[] | Prisma.DailySessionScalarFieldEnum;
    having?: Prisma.DailySessionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DailySessionCountAggregateInputType | true;
    _min?: DailySessionMinAggregateInputType;
    _max?: DailySessionMaxAggregateInputType;
};
export type DailySessionGroupByOutputType = {
    id: string;
    date: Date;
    status: string;
    userId: string;
    _count: DailySessionCountAggregateOutputType | null;
    _min: DailySessionMinAggregateOutputType | null;
    _max: DailySessionMaxAggregateOutputType | null;
};
export type GetDailySessionGroupByPayload<T extends DailySessionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DailySessionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DailySessionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DailySessionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DailySessionGroupByOutputType[P]>;
}>>;
export type DailySessionWhereInput = {
    AND?: Prisma.DailySessionWhereInput | Prisma.DailySessionWhereInput[];
    OR?: Prisma.DailySessionWhereInput[];
    NOT?: Prisma.DailySessionWhereInput | Prisma.DailySessionWhereInput[];
    id?: Prisma.StringFilter<"DailySession"> | string;
    date?: Prisma.DateTimeFilter<"DailySession"> | Date | string;
    status?: Prisma.StringFilter<"DailySession"> | string;
    userId?: Prisma.StringFilter<"DailySession"> | string;
    Questions?: Prisma.QuestionListRelationFilter;
    Entry?: Prisma.XOR<Prisma.EntryNullableScalarRelationFilter, Prisma.EntryWhereInput> | null;
    Snippets?: Prisma.SnippetListRelationFilter;
    User?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type DailySessionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    Questions?: Prisma.QuestionOrderByRelationAggregateInput;
    Entry?: Prisma.EntryOrderByWithRelationInput;
    Snippets?: Prisma.SnippetOrderByRelationAggregateInput;
    User?: Prisma.UserOrderByWithRelationInput;
};
export type DailySessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    date?: Date | string;
    AND?: Prisma.DailySessionWhereInput | Prisma.DailySessionWhereInput[];
    OR?: Prisma.DailySessionWhereInput[];
    NOT?: Prisma.DailySessionWhereInput | Prisma.DailySessionWhereInput[];
    status?: Prisma.StringFilter<"DailySession"> | string;
    userId?: Prisma.StringFilter<"DailySession"> | string;
    Questions?: Prisma.QuestionListRelationFilter;
    Entry?: Prisma.XOR<Prisma.EntryNullableScalarRelationFilter, Prisma.EntryWhereInput> | null;
    Snippets?: Prisma.SnippetListRelationFilter;
    User?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "date">;
export type DailySessionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    _count?: Prisma.DailySessionCountOrderByAggregateInput;
    _max?: Prisma.DailySessionMaxOrderByAggregateInput;
    _min?: Prisma.DailySessionMinOrderByAggregateInput;
};
export type DailySessionScalarWhereWithAggregatesInput = {
    AND?: Prisma.DailySessionScalarWhereWithAggregatesInput | Prisma.DailySessionScalarWhereWithAggregatesInput[];
    OR?: Prisma.DailySessionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DailySessionScalarWhereWithAggregatesInput | Prisma.DailySessionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"DailySession"> | string;
    date?: Prisma.DateTimeWithAggregatesFilter<"DailySession"> | Date | string;
    status?: Prisma.StringWithAggregatesFilter<"DailySession"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"DailySession"> | string;
};
export type DailySessionCreateInput = {
    id?: string;
    date: Date | string;
    status?: string;
    Questions?: Prisma.QuestionCreateNestedManyWithoutSessionInput;
    Entry?: Prisma.EntryCreateNestedOneWithoutSessionInput;
    Snippets?: Prisma.SnippetCreateNestedManyWithoutSessionInput;
    User: Prisma.UserCreateNestedOneWithoutDailySessionsInput;
};
export type DailySessionUncheckedCreateInput = {
    id?: string;
    date: Date | string;
    status?: string;
    userId: string;
    Questions?: Prisma.QuestionUncheckedCreateNestedManyWithoutSessionInput;
    Entry?: Prisma.EntryUncheckedCreateNestedOneWithoutSessionInput;
    Snippets?: Prisma.SnippetUncheckedCreateNestedManyWithoutSessionInput;
};
export type DailySessionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    Questions?: Prisma.QuestionUpdateManyWithoutSessionNestedInput;
    Entry?: Prisma.EntryUpdateOneWithoutSessionNestedInput;
    Snippets?: Prisma.SnippetUpdateManyWithoutSessionNestedInput;
    User?: Prisma.UserUpdateOneRequiredWithoutDailySessionsNestedInput;
};
export type DailySessionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    Questions?: Prisma.QuestionUncheckedUpdateManyWithoutSessionNestedInput;
    Entry?: Prisma.EntryUncheckedUpdateOneWithoutSessionNestedInput;
    Snippets?: Prisma.SnippetUncheckedUpdateManyWithoutSessionNestedInput;
};
export type DailySessionCreateManyInput = {
    id?: string;
    date: Date | string;
    status?: string;
    userId: string;
};
export type DailySessionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type DailySessionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type DailySessionListRelationFilter = {
    every?: Prisma.DailySessionWhereInput;
    some?: Prisma.DailySessionWhereInput;
    none?: Prisma.DailySessionWhereInput;
};
export type DailySessionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type DailySessionNullableScalarRelationFilter = {
    is?: Prisma.DailySessionWhereInput | null;
    isNot?: Prisma.DailySessionWhereInput | null;
};
export type DailySessionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type DailySessionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type DailySessionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type DailySessionCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.DailySessionCreateWithoutUserInput, Prisma.DailySessionUncheckedCreateWithoutUserInput> | Prisma.DailySessionCreateWithoutUserInput[] | Prisma.DailySessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.DailySessionCreateOrConnectWithoutUserInput | Prisma.DailySessionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.DailySessionCreateManyUserInputEnvelope;
    connect?: Prisma.DailySessionWhereUniqueInput | Prisma.DailySessionWhereUniqueInput[];
};
export type DailySessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.DailySessionCreateWithoutUserInput, Prisma.DailySessionUncheckedCreateWithoutUserInput> | Prisma.DailySessionCreateWithoutUserInput[] | Prisma.DailySessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.DailySessionCreateOrConnectWithoutUserInput | Prisma.DailySessionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.DailySessionCreateManyUserInputEnvelope;
    connect?: Prisma.DailySessionWhereUniqueInput | Prisma.DailySessionWhereUniqueInput[];
};
export type DailySessionUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.DailySessionCreateWithoutUserInput, Prisma.DailySessionUncheckedCreateWithoutUserInput> | Prisma.DailySessionCreateWithoutUserInput[] | Prisma.DailySessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.DailySessionCreateOrConnectWithoutUserInput | Prisma.DailySessionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.DailySessionUpsertWithWhereUniqueWithoutUserInput | Prisma.DailySessionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.DailySessionCreateManyUserInputEnvelope;
    set?: Prisma.DailySessionWhereUniqueInput | Prisma.DailySessionWhereUniqueInput[];
    disconnect?: Prisma.DailySessionWhereUniqueInput | Prisma.DailySessionWhereUniqueInput[];
    delete?: Prisma.DailySessionWhereUniqueInput | Prisma.DailySessionWhereUniqueInput[];
    connect?: Prisma.DailySessionWhereUniqueInput | Prisma.DailySessionWhereUniqueInput[];
    update?: Prisma.DailySessionUpdateWithWhereUniqueWithoutUserInput | Prisma.DailySessionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.DailySessionUpdateManyWithWhereWithoutUserInput | Prisma.DailySessionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.DailySessionScalarWhereInput | Prisma.DailySessionScalarWhereInput[];
};
export type DailySessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.DailySessionCreateWithoutUserInput, Prisma.DailySessionUncheckedCreateWithoutUserInput> | Prisma.DailySessionCreateWithoutUserInput[] | Prisma.DailySessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.DailySessionCreateOrConnectWithoutUserInput | Prisma.DailySessionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.DailySessionUpsertWithWhereUniqueWithoutUserInput | Prisma.DailySessionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.DailySessionCreateManyUserInputEnvelope;
    set?: Prisma.DailySessionWhereUniqueInput | Prisma.DailySessionWhereUniqueInput[];
    disconnect?: Prisma.DailySessionWhereUniqueInput | Prisma.DailySessionWhereUniqueInput[];
    delete?: Prisma.DailySessionWhereUniqueInput | Prisma.DailySessionWhereUniqueInput[];
    connect?: Prisma.DailySessionWhereUniqueInput | Prisma.DailySessionWhereUniqueInput[];
    update?: Prisma.DailySessionUpdateWithWhereUniqueWithoutUserInput | Prisma.DailySessionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.DailySessionUpdateManyWithWhereWithoutUserInput | Prisma.DailySessionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.DailySessionScalarWhereInput | Prisma.DailySessionScalarWhereInput[];
};
export type DailySessionCreateNestedOneWithoutSnippetsInput = {
    create?: Prisma.XOR<Prisma.DailySessionCreateWithoutSnippetsInput, Prisma.DailySessionUncheckedCreateWithoutSnippetsInput>;
    connectOrCreate?: Prisma.DailySessionCreateOrConnectWithoutSnippetsInput;
    connect?: Prisma.DailySessionWhereUniqueInput;
};
export type DailySessionUpdateOneWithoutSnippetsNestedInput = {
    create?: Prisma.XOR<Prisma.DailySessionCreateWithoutSnippetsInput, Prisma.DailySessionUncheckedCreateWithoutSnippetsInput>;
    connectOrCreate?: Prisma.DailySessionCreateOrConnectWithoutSnippetsInput;
    upsert?: Prisma.DailySessionUpsertWithoutSnippetsInput;
    disconnect?: Prisma.DailySessionWhereInput | boolean;
    delete?: Prisma.DailySessionWhereInput | boolean;
    connect?: Prisma.DailySessionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DailySessionUpdateToOneWithWhereWithoutSnippetsInput, Prisma.DailySessionUpdateWithoutSnippetsInput>, Prisma.DailySessionUncheckedUpdateWithoutSnippetsInput>;
};
export type DailySessionCreateNestedOneWithoutQuestionsInput = {
    create?: Prisma.XOR<Prisma.DailySessionCreateWithoutQuestionsInput, Prisma.DailySessionUncheckedCreateWithoutQuestionsInput>;
    connectOrCreate?: Prisma.DailySessionCreateOrConnectWithoutQuestionsInput;
    connect?: Prisma.DailySessionWhereUniqueInput;
};
export type DailySessionUpdateOneWithoutQuestionsNestedInput = {
    create?: Prisma.XOR<Prisma.DailySessionCreateWithoutQuestionsInput, Prisma.DailySessionUncheckedCreateWithoutQuestionsInput>;
    connectOrCreate?: Prisma.DailySessionCreateOrConnectWithoutQuestionsInput;
    upsert?: Prisma.DailySessionUpsertWithoutQuestionsInput;
    disconnect?: Prisma.DailySessionWhereInput | boolean;
    delete?: Prisma.DailySessionWhereInput | boolean;
    connect?: Prisma.DailySessionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DailySessionUpdateToOneWithWhereWithoutQuestionsInput, Prisma.DailySessionUpdateWithoutQuestionsInput>, Prisma.DailySessionUncheckedUpdateWithoutQuestionsInput>;
};
export type DailySessionCreateNestedOneWithoutEntryInput = {
    create?: Prisma.XOR<Prisma.DailySessionCreateWithoutEntryInput, Prisma.DailySessionUncheckedCreateWithoutEntryInput>;
    connectOrCreate?: Prisma.DailySessionCreateOrConnectWithoutEntryInput;
    connect?: Prisma.DailySessionWhereUniqueInput;
};
export type DailySessionUpdateOneWithoutEntryNestedInput = {
    create?: Prisma.XOR<Prisma.DailySessionCreateWithoutEntryInput, Prisma.DailySessionUncheckedCreateWithoutEntryInput>;
    connectOrCreate?: Prisma.DailySessionCreateOrConnectWithoutEntryInput;
    upsert?: Prisma.DailySessionUpsertWithoutEntryInput;
    disconnect?: Prisma.DailySessionWhereInput | boolean;
    delete?: Prisma.DailySessionWhereInput | boolean;
    connect?: Prisma.DailySessionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DailySessionUpdateToOneWithWhereWithoutEntryInput, Prisma.DailySessionUpdateWithoutEntryInput>, Prisma.DailySessionUncheckedUpdateWithoutEntryInput>;
};
export type DailySessionCreateWithoutUserInput = {
    id?: string;
    date: Date | string;
    status?: string;
    Questions?: Prisma.QuestionCreateNestedManyWithoutSessionInput;
    Entry?: Prisma.EntryCreateNestedOneWithoutSessionInput;
    Snippets?: Prisma.SnippetCreateNestedManyWithoutSessionInput;
};
export type DailySessionUncheckedCreateWithoutUserInput = {
    id?: string;
    date: Date | string;
    status?: string;
    Questions?: Prisma.QuestionUncheckedCreateNestedManyWithoutSessionInput;
    Entry?: Prisma.EntryUncheckedCreateNestedOneWithoutSessionInput;
    Snippets?: Prisma.SnippetUncheckedCreateNestedManyWithoutSessionInput;
};
export type DailySessionCreateOrConnectWithoutUserInput = {
    where: Prisma.DailySessionWhereUniqueInput;
    create: Prisma.XOR<Prisma.DailySessionCreateWithoutUserInput, Prisma.DailySessionUncheckedCreateWithoutUserInput>;
};
export type DailySessionCreateManyUserInputEnvelope = {
    data: Prisma.DailySessionCreateManyUserInput | Prisma.DailySessionCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type DailySessionUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.DailySessionWhereUniqueInput;
    update: Prisma.XOR<Prisma.DailySessionUpdateWithoutUserInput, Prisma.DailySessionUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.DailySessionCreateWithoutUserInput, Prisma.DailySessionUncheckedCreateWithoutUserInput>;
};
export type DailySessionUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.DailySessionWhereUniqueInput;
    data: Prisma.XOR<Prisma.DailySessionUpdateWithoutUserInput, Prisma.DailySessionUncheckedUpdateWithoutUserInput>;
};
export type DailySessionUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.DailySessionScalarWhereInput;
    data: Prisma.XOR<Prisma.DailySessionUpdateManyMutationInput, Prisma.DailySessionUncheckedUpdateManyWithoutUserInput>;
};
export type DailySessionScalarWhereInput = {
    AND?: Prisma.DailySessionScalarWhereInput | Prisma.DailySessionScalarWhereInput[];
    OR?: Prisma.DailySessionScalarWhereInput[];
    NOT?: Prisma.DailySessionScalarWhereInput | Prisma.DailySessionScalarWhereInput[];
    id?: Prisma.StringFilter<"DailySession"> | string;
    date?: Prisma.DateTimeFilter<"DailySession"> | Date | string;
    status?: Prisma.StringFilter<"DailySession"> | string;
    userId?: Prisma.StringFilter<"DailySession"> | string;
};
export type DailySessionCreateWithoutSnippetsInput = {
    id?: string;
    date: Date | string;
    status?: string;
    Questions?: Prisma.QuestionCreateNestedManyWithoutSessionInput;
    Entry?: Prisma.EntryCreateNestedOneWithoutSessionInput;
    User: Prisma.UserCreateNestedOneWithoutDailySessionsInput;
};
export type DailySessionUncheckedCreateWithoutSnippetsInput = {
    id?: string;
    date: Date | string;
    status?: string;
    userId: string;
    Questions?: Prisma.QuestionUncheckedCreateNestedManyWithoutSessionInput;
    Entry?: Prisma.EntryUncheckedCreateNestedOneWithoutSessionInput;
};
export type DailySessionCreateOrConnectWithoutSnippetsInput = {
    where: Prisma.DailySessionWhereUniqueInput;
    create: Prisma.XOR<Prisma.DailySessionCreateWithoutSnippetsInput, Prisma.DailySessionUncheckedCreateWithoutSnippetsInput>;
};
export type DailySessionUpsertWithoutSnippetsInput = {
    update: Prisma.XOR<Prisma.DailySessionUpdateWithoutSnippetsInput, Prisma.DailySessionUncheckedUpdateWithoutSnippetsInput>;
    create: Prisma.XOR<Prisma.DailySessionCreateWithoutSnippetsInput, Prisma.DailySessionUncheckedCreateWithoutSnippetsInput>;
    where?: Prisma.DailySessionWhereInput;
};
export type DailySessionUpdateToOneWithWhereWithoutSnippetsInput = {
    where?: Prisma.DailySessionWhereInput;
    data: Prisma.XOR<Prisma.DailySessionUpdateWithoutSnippetsInput, Prisma.DailySessionUncheckedUpdateWithoutSnippetsInput>;
};
export type DailySessionUpdateWithoutSnippetsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    Questions?: Prisma.QuestionUpdateManyWithoutSessionNestedInput;
    Entry?: Prisma.EntryUpdateOneWithoutSessionNestedInput;
    User?: Prisma.UserUpdateOneRequiredWithoutDailySessionsNestedInput;
};
export type DailySessionUncheckedUpdateWithoutSnippetsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    Questions?: Prisma.QuestionUncheckedUpdateManyWithoutSessionNestedInput;
    Entry?: Prisma.EntryUncheckedUpdateOneWithoutSessionNestedInput;
};
export type DailySessionCreateWithoutQuestionsInput = {
    id?: string;
    date: Date | string;
    status?: string;
    Entry?: Prisma.EntryCreateNestedOneWithoutSessionInput;
    Snippets?: Prisma.SnippetCreateNestedManyWithoutSessionInput;
    User: Prisma.UserCreateNestedOneWithoutDailySessionsInput;
};
export type DailySessionUncheckedCreateWithoutQuestionsInput = {
    id?: string;
    date: Date | string;
    status?: string;
    userId: string;
    Entry?: Prisma.EntryUncheckedCreateNestedOneWithoutSessionInput;
    Snippets?: Prisma.SnippetUncheckedCreateNestedManyWithoutSessionInput;
};
export type DailySessionCreateOrConnectWithoutQuestionsInput = {
    where: Prisma.DailySessionWhereUniqueInput;
    create: Prisma.XOR<Prisma.DailySessionCreateWithoutQuestionsInput, Prisma.DailySessionUncheckedCreateWithoutQuestionsInput>;
};
export type DailySessionUpsertWithoutQuestionsInput = {
    update: Prisma.XOR<Prisma.DailySessionUpdateWithoutQuestionsInput, Prisma.DailySessionUncheckedUpdateWithoutQuestionsInput>;
    create: Prisma.XOR<Prisma.DailySessionCreateWithoutQuestionsInput, Prisma.DailySessionUncheckedCreateWithoutQuestionsInput>;
    where?: Prisma.DailySessionWhereInput;
};
export type DailySessionUpdateToOneWithWhereWithoutQuestionsInput = {
    where?: Prisma.DailySessionWhereInput;
    data: Prisma.XOR<Prisma.DailySessionUpdateWithoutQuestionsInput, Prisma.DailySessionUncheckedUpdateWithoutQuestionsInput>;
};
export type DailySessionUpdateWithoutQuestionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    Entry?: Prisma.EntryUpdateOneWithoutSessionNestedInput;
    Snippets?: Prisma.SnippetUpdateManyWithoutSessionNestedInput;
    User?: Prisma.UserUpdateOneRequiredWithoutDailySessionsNestedInput;
};
export type DailySessionUncheckedUpdateWithoutQuestionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    Entry?: Prisma.EntryUncheckedUpdateOneWithoutSessionNestedInput;
    Snippets?: Prisma.SnippetUncheckedUpdateManyWithoutSessionNestedInput;
};
export type DailySessionCreateWithoutEntryInput = {
    id?: string;
    date: Date | string;
    status?: string;
    Questions?: Prisma.QuestionCreateNestedManyWithoutSessionInput;
    Snippets?: Prisma.SnippetCreateNestedManyWithoutSessionInput;
    User: Prisma.UserCreateNestedOneWithoutDailySessionsInput;
};
export type DailySessionUncheckedCreateWithoutEntryInput = {
    id?: string;
    date: Date | string;
    status?: string;
    userId: string;
    Questions?: Prisma.QuestionUncheckedCreateNestedManyWithoutSessionInput;
    Snippets?: Prisma.SnippetUncheckedCreateNestedManyWithoutSessionInput;
};
export type DailySessionCreateOrConnectWithoutEntryInput = {
    where: Prisma.DailySessionWhereUniqueInput;
    create: Prisma.XOR<Prisma.DailySessionCreateWithoutEntryInput, Prisma.DailySessionUncheckedCreateWithoutEntryInput>;
};
export type DailySessionUpsertWithoutEntryInput = {
    update: Prisma.XOR<Prisma.DailySessionUpdateWithoutEntryInput, Prisma.DailySessionUncheckedUpdateWithoutEntryInput>;
    create: Prisma.XOR<Prisma.DailySessionCreateWithoutEntryInput, Prisma.DailySessionUncheckedCreateWithoutEntryInput>;
    where?: Prisma.DailySessionWhereInput;
};
export type DailySessionUpdateToOneWithWhereWithoutEntryInput = {
    where?: Prisma.DailySessionWhereInput;
    data: Prisma.XOR<Prisma.DailySessionUpdateWithoutEntryInput, Prisma.DailySessionUncheckedUpdateWithoutEntryInput>;
};
export type DailySessionUpdateWithoutEntryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    Questions?: Prisma.QuestionUpdateManyWithoutSessionNestedInput;
    Snippets?: Prisma.SnippetUpdateManyWithoutSessionNestedInput;
    User?: Prisma.UserUpdateOneRequiredWithoutDailySessionsNestedInput;
};
export type DailySessionUncheckedUpdateWithoutEntryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    Questions?: Prisma.QuestionUncheckedUpdateManyWithoutSessionNestedInput;
    Snippets?: Prisma.SnippetUncheckedUpdateManyWithoutSessionNestedInput;
};
export type DailySessionCreateManyUserInput = {
    id?: string;
    date: Date | string;
    status?: string;
};
export type DailySessionUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    Questions?: Prisma.QuestionUpdateManyWithoutSessionNestedInput;
    Entry?: Prisma.EntryUpdateOneWithoutSessionNestedInput;
    Snippets?: Prisma.SnippetUpdateManyWithoutSessionNestedInput;
};
export type DailySessionUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    Questions?: Prisma.QuestionUncheckedUpdateManyWithoutSessionNestedInput;
    Entry?: Prisma.EntryUncheckedUpdateOneWithoutSessionNestedInput;
    Snippets?: Prisma.SnippetUncheckedUpdateManyWithoutSessionNestedInput;
};
export type DailySessionUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type DailySessionCountOutputType = {
    Questions: number;
    Snippets: number;
};
export type DailySessionCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    Questions?: boolean | DailySessionCountOutputTypeCountQuestionsArgs;
    Snippets?: boolean | DailySessionCountOutputTypeCountSnippetsArgs;
};
export type DailySessionCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DailySessionCountOutputTypeSelect<ExtArgs> | null;
};
export type DailySessionCountOutputTypeCountQuestionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestionWhereInput;
};
export type DailySessionCountOutputTypeCountSnippetsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SnippetWhereInput;
};
export type DailySessionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    date?: boolean;
    status?: boolean;
    userId?: boolean;
    Questions?: boolean | Prisma.DailySession$QuestionsArgs<ExtArgs>;
    Entry?: boolean | Prisma.DailySession$EntryArgs<ExtArgs>;
    Snippets?: boolean | Prisma.DailySession$SnippetsArgs<ExtArgs>;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    _count?: boolean | Prisma.DailySessionCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["dailySession"]>;
export type DailySessionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    date?: boolean;
    status?: boolean;
    userId?: boolean;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["dailySession"]>;
export type DailySessionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    date?: boolean;
    status?: boolean;
    userId?: boolean;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["dailySession"]>;
export type DailySessionSelectScalar = {
    id?: boolean;
    date?: boolean;
    status?: boolean;
    userId?: boolean;
};
export type DailySessionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "date" | "status" | "userId", ExtArgs["result"]["dailySession"]>;
export type DailySessionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    Questions?: boolean | Prisma.DailySession$QuestionsArgs<ExtArgs>;
    Entry?: boolean | Prisma.DailySession$EntryArgs<ExtArgs>;
    Snippets?: boolean | Prisma.DailySession$SnippetsArgs<ExtArgs>;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    _count?: boolean | Prisma.DailySessionCountOutputTypeDefaultArgs<ExtArgs>;
};
export type DailySessionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type DailySessionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $DailySessionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "DailySession";
    objects: {
        Questions: Prisma.$QuestionPayload<ExtArgs>[];
        Entry: Prisma.$EntryPayload<ExtArgs> | null;
        Snippets: Prisma.$SnippetPayload<ExtArgs>[];
        User: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        date: Date;
        status: string;
        userId: string;
    }, ExtArgs["result"]["dailySession"]>;
    composites: {};
};
export type DailySessionGetPayload<S extends boolean | null | undefined | DailySessionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DailySessionPayload, S>;
export type DailySessionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DailySessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DailySessionCountAggregateInputType | true;
};
export interface DailySessionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['DailySession'];
        meta: {
            name: 'DailySession';
        };
    };
    findUnique<T extends DailySessionFindUniqueArgs>(args: Prisma.SelectSubset<T, DailySessionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DailySessionClient<runtime.Types.Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DailySessionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DailySessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DailySessionClient<runtime.Types.Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DailySessionFindFirstArgs>(args?: Prisma.SelectSubset<T, DailySessionFindFirstArgs<ExtArgs>>): Prisma.Prisma__DailySessionClient<runtime.Types.Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DailySessionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DailySessionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DailySessionClient<runtime.Types.Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DailySessionFindManyArgs>(args?: Prisma.SelectSubset<T, DailySessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DailySessionCreateArgs>(args: Prisma.SelectSubset<T, DailySessionCreateArgs<ExtArgs>>): Prisma.Prisma__DailySessionClient<runtime.Types.Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DailySessionCreateManyArgs>(args?: Prisma.SelectSubset<T, DailySessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DailySessionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DailySessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DailySessionDeleteArgs>(args: Prisma.SelectSubset<T, DailySessionDeleteArgs<ExtArgs>>): Prisma.Prisma__DailySessionClient<runtime.Types.Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DailySessionUpdateArgs>(args: Prisma.SelectSubset<T, DailySessionUpdateArgs<ExtArgs>>): Prisma.Prisma__DailySessionClient<runtime.Types.Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DailySessionDeleteManyArgs>(args?: Prisma.SelectSubset<T, DailySessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DailySessionUpdateManyArgs>(args: Prisma.SelectSubset<T, DailySessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DailySessionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DailySessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DailySessionUpsertArgs>(args: Prisma.SelectSubset<T, DailySessionUpsertArgs<ExtArgs>>): Prisma.Prisma__DailySessionClient<runtime.Types.Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DailySessionCountArgs>(args?: Prisma.Subset<T, DailySessionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DailySessionCountAggregateOutputType> : number>;
    aggregate<T extends DailySessionAggregateArgs>(args: Prisma.Subset<T, DailySessionAggregateArgs>): Prisma.PrismaPromise<GetDailySessionAggregateType<T>>;
    groupBy<T extends DailySessionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DailySessionGroupByArgs['orderBy'];
    } : {
        orderBy?: DailySessionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DailySessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDailySessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DailySessionFieldRefs;
}
export interface Prisma__DailySessionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    Questions<T extends Prisma.DailySession$QuestionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DailySession$QuestionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    Entry<T extends Prisma.DailySession$EntryArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DailySession$EntryArgs<ExtArgs>>): Prisma.Prisma__EntryClient<runtime.Types.Result.GetResult<Prisma.$EntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    Snippets<T extends Prisma.DailySession$SnippetsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DailySession$SnippetsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    User<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DailySessionFieldRefs {
    readonly id: Prisma.FieldRef<"DailySession", 'String'>;
    readonly date: Prisma.FieldRef<"DailySession", 'DateTime'>;
    readonly status: Prisma.FieldRef<"DailySession", 'String'>;
    readonly userId: Prisma.FieldRef<"DailySession", 'String'>;
}
export type DailySessionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DailySessionSelect<ExtArgs> | null;
    omit?: Prisma.DailySessionOmit<ExtArgs> | null;
    include?: Prisma.DailySessionInclude<ExtArgs> | null;
    where: Prisma.DailySessionWhereUniqueInput;
};
export type DailySessionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DailySessionSelect<ExtArgs> | null;
    omit?: Prisma.DailySessionOmit<ExtArgs> | null;
    include?: Prisma.DailySessionInclude<ExtArgs> | null;
    where: Prisma.DailySessionWhereUniqueInput;
};
export type DailySessionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DailySessionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DailySessionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DailySessionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DailySessionSelect<ExtArgs> | null;
    omit?: Prisma.DailySessionOmit<ExtArgs> | null;
    include?: Prisma.DailySessionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DailySessionCreateInput, Prisma.DailySessionUncheckedCreateInput>;
};
export type DailySessionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DailySessionCreateManyInput | Prisma.DailySessionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DailySessionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DailySessionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DailySessionOmit<ExtArgs> | null;
    data: Prisma.DailySessionCreateManyInput | Prisma.DailySessionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.DailySessionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type DailySessionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DailySessionSelect<ExtArgs> | null;
    omit?: Prisma.DailySessionOmit<ExtArgs> | null;
    include?: Prisma.DailySessionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DailySessionUpdateInput, Prisma.DailySessionUncheckedUpdateInput>;
    where: Prisma.DailySessionWhereUniqueInput;
};
export type DailySessionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DailySessionUpdateManyMutationInput, Prisma.DailySessionUncheckedUpdateManyInput>;
    where?: Prisma.DailySessionWhereInput;
    limit?: number;
};
export type DailySessionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DailySessionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DailySessionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DailySessionUpdateManyMutationInput, Prisma.DailySessionUncheckedUpdateManyInput>;
    where?: Prisma.DailySessionWhereInput;
    limit?: number;
    include?: Prisma.DailySessionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type DailySessionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DailySessionSelect<ExtArgs> | null;
    omit?: Prisma.DailySessionOmit<ExtArgs> | null;
    include?: Prisma.DailySessionInclude<ExtArgs> | null;
    where: Prisma.DailySessionWhereUniqueInput;
    create: Prisma.XOR<Prisma.DailySessionCreateInput, Prisma.DailySessionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DailySessionUpdateInput, Prisma.DailySessionUncheckedUpdateInput>;
};
export type DailySessionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DailySessionSelect<ExtArgs> | null;
    omit?: Prisma.DailySessionOmit<ExtArgs> | null;
    include?: Prisma.DailySessionInclude<ExtArgs> | null;
    where: Prisma.DailySessionWhereUniqueInput;
};
export type DailySessionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DailySessionWhereInput;
    limit?: number;
};
export type DailySession$QuestionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DailySession$EntryArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntrySelect<ExtArgs> | null;
    omit?: Prisma.EntryOmit<ExtArgs> | null;
    include?: Prisma.EntryInclude<ExtArgs> | null;
    where?: Prisma.EntryWhereInput;
};
export type DailySession$SnippetsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DailySessionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DailySessionSelect<ExtArgs> | null;
    omit?: Prisma.DailySessionOmit<ExtArgs> | null;
    include?: Prisma.DailySessionInclude<ExtArgs> | null;
};
