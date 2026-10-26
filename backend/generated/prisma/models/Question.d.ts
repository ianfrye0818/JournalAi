import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type QuestionModel = runtime.Types.Result.DefaultSelection<Prisma.$QuestionPayload>;
export type AggregateQuestion = {
    _count: QuestionCountAggregateOutputType | null;
    _avg: QuestionAvgAggregateOutputType | null;
    _sum: QuestionSumAggregateOutputType | null;
    _min: QuestionMinAggregateOutputType | null;
    _max: QuestionMaxAggregateOutputType | null;
};
export type QuestionAvgAggregateOutputType = {
    order: number | null;
};
export type QuestionSumAggregateOutputType = {
    order: number | null;
};
export type QuestionMinAggregateOutputType = {
    id: string | null;
    sessionId: string | null;
    text: string | null;
    answer: string | null;
    skipped: boolean | null;
    order: number | null;
    userId: string | null;
};
export type QuestionMaxAggregateOutputType = {
    id: string | null;
    sessionId: string | null;
    text: string | null;
    answer: string | null;
    skipped: boolean | null;
    order: number | null;
    userId: string | null;
};
export type QuestionCountAggregateOutputType = {
    id: number;
    sessionId: number;
    text: number;
    answer: number;
    skipped: number;
    order: number;
    userId: number;
    _all: number;
};
export type QuestionAvgAggregateInputType = {
    order?: true;
};
export type QuestionSumAggregateInputType = {
    order?: true;
};
export type QuestionMinAggregateInputType = {
    id?: true;
    sessionId?: true;
    text?: true;
    answer?: true;
    skipped?: true;
    order?: true;
    userId?: true;
};
export type QuestionMaxAggregateInputType = {
    id?: true;
    sessionId?: true;
    text?: true;
    answer?: true;
    skipped?: true;
    order?: true;
    userId?: true;
};
export type QuestionCountAggregateInputType = {
    id?: true;
    sessionId?: true;
    text?: true;
    answer?: true;
    skipped?: true;
    order?: true;
    userId?: true;
    _all?: true;
};
export type QuestionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestionWhereInput;
    orderBy?: Prisma.QuestionOrderByWithRelationInput | Prisma.QuestionOrderByWithRelationInput[];
    cursor?: Prisma.QuestionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | QuestionCountAggregateInputType;
    _avg?: QuestionAvgAggregateInputType;
    _sum?: QuestionSumAggregateInputType;
    _min?: QuestionMinAggregateInputType;
    _max?: QuestionMaxAggregateInputType;
};
export type GetQuestionAggregateType<T extends QuestionAggregateArgs> = {
    [P in keyof T & keyof AggregateQuestion]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateQuestion[P]> : Prisma.GetScalarType<T[P], AggregateQuestion[P]>;
};
export type QuestionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestionWhereInput;
    orderBy?: Prisma.QuestionOrderByWithAggregationInput | Prisma.QuestionOrderByWithAggregationInput[];
    by: Prisma.QuestionScalarFieldEnum[] | Prisma.QuestionScalarFieldEnum;
    having?: Prisma.QuestionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: QuestionCountAggregateInputType | true;
    _avg?: QuestionAvgAggregateInputType;
    _sum?: QuestionSumAggregateInputType;
    _min?: QuestionMinAggregateInputType;
    _max?: QuestionMaxAggregateInputType;
};
export type QuestionGroupByOutputType = {
    id: string;
    sessionId: string;
    text: string;
    answer: string | null;
    skipped: boolean;
    order: number;
    userId: string;
    _count: QuestionCountAggregateOutputType | null;
    _avg: QuestionAvgAggregateOutputType | null;
    _sum: QuestionSumAggregateOutputType | null;
    _min: QuestionMinAggregateOutputType | null;
    _max: QuestionMaxAggregateOutputType | null;
};
export type GetQuestionGroupByPayload<T extends QuestionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<QuestionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof QuestionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], QuestionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], QuestionGroupByOutputType[P]>;
}>>;
export type QuestionWhereInput = {
    AND?: Prisma.QuestionWhereInput | Prisma.QuestionWhereInput[];
    OR?: Prisma.QuestionWhereInput[];
    NOT?: Prisma.QuestionWhereInput | Prisma.QuestionWhereInput[];
    id?: Prisma.StringFilter<"Question"> | string;
    sessionId?: Prisma.StringFilter<"Question"> | string;
    text?: Prisma.StringFilter<"Question"> | string;
    answer?: Prisma.StringNullableFilter<"Question"> | string | null;
    skipped?: Prisma.BoolFilter<"Question"> | boolean;
    order?: Prisma.IntFilter<"Question"> | number;
    userId?: Prisma.StringFilter<"Question"> | string;
    Session?: Prisma.XOR<Prisma.DailySessionNullableScalarRelationFilter, Prisma.DailySessionWhereInput> | null;
    User?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type QuestionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    sessionId?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    answer?: Prisma.SortOrderInput | Prisma.SortOrder;
    skipped?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    Session?: Prisma.DailySessionOrderByWithRelationInput;
    User?: Prisma.UserOrderByWithRelationInput;
};
export type QuestionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    sessionId?: string;
    AND?: Prisma.QuestionWhereInput | Prisma.QuestionWhereInput[];
    OR?: Prisma.QuestionWhereInput[];
    NOT?: Prisma.QuestionWhereInput | Prisma.QuestionWhereInput[];
    text?: Prisma.StringFilter<"Question"> | string;
    answer?: Prisma.StringNullableFilter<"Question"> | string | null;
    skipped?: Prisma.BoolFilter<"Question"> | boolean;
    order?: Prisma.IntFilter<"Question"> | number;
    userId?: Prisma.StringFilter<"Question"> | string;
    Session?: Prisma.XOR<Prisma.DailySessionNullableScalarRelationFilter, Prisma.DailySessionWhereInput> | null;
    User?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "sessionId">;
export type QuestionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    sessionId?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    answer?: Prisma.SortOrderInput | Prisma.SortOrder;
    skipped?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    _count?: Prisma.QuestionCountOrderByAggregateInput;
    _avg?: Prisma.QuestionAvgOrderByAggregateInput;
    _max?: Prisma.QuestionMaxOrderByAggregateInput;
    _min?: Prisma.QuestionMinOrderByAggregateInput;
    _sum?: Prisma.QuestionSumOrderByAggregateInput;
};
export type QuestionScalarWhereWithAggregatesInput = {
    AND?: Prisma.QuestionScalarWhereWithAggregatesInput | Prisma.QuestionScalarWhereWithAggregatesInput[];
    OR?: Prisma.QuestionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.QuestionScalarWhereWithAggregatesInput | Prisma.QuestionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Question"> | string;
    sessionId?: Prisma.StringWithAggregatesFilter<"Question"> | string;
    text?: Prisma.StringWithAggregatesFilter<"Question"> | string;
    answer?: Prisma.StringNullableWithAggregatesFilter<"Question"> | string | null;
    skipped?: Prisma.BoolWithAggregatesFilter<"Question"> | boolean;
    order?: Prisma.IntWithAggregatesFilter<"Question"> | number;
    userId?: Prisma.StringWithAggregatesFilter<"Question"> | string;
};
export type QuestionCreateInput = {
    id?: string;
    text: string;
    answer?: string | null;
    skipped?: boolean;
    order: number;
    Session?: Prisma.DailySessionCreateNestedOneWithoutQuestionsInput;
    User: Prisma.UserCreateNestedOneWithoutQuestionsInput;
};
export type QuestionUncheckedCreateInput = {
    id?: string;
    sessionId: string;
    text: string;
    answer?: string | null;
    skipped?: boolean;
    order: number;
    userId: string;
};
export type QuestionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    answer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    skipped?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    Session?: Prisma.DailySessionUpdateOneWithoutQuestionsNestedInput;
    User?: Prisma.UserUpdateOneRequiredWithoutQuestionsNestedInput;
};
export type QuestionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionId?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    answer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    skipped?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type QuestionCreateManyInput = {
    id?: string;
    sessionId: string;
    text: string;
    answer?: string | null;
    skipped?: boolean;
    order: number;
    userId: string;
};
export type QuestionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    answer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    skipped?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type QuestionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionId?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    answer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    skipped?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type QuestionListRelationFilter = {
    every?: Prisma.QuestionWhereInput;
    some?: Prisma.QuestionWhereInput;
    none?: Prisma.QuestionWhereInput;
};
export type QuestionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type QuestionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sessionId?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    answer?: Prisma.SortOrder;
    skipped?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type QuestionAvgOrderByAggregateInput = {
    order?: Prisma.SortOrder;
};
export type QuestionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sessionId?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    answer?: Prisma.SortOrder;
    skipped?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type QuestionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sessionId?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    answer?: Prisma.SortOrder;
    skipped?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type QuestionSumOrderByAggregateInput = {
    order?: Prisma.SortOrder;
};
export type QuestionCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutUserInput, Prisma.QuestionUncheckedCreateWithoutUserInput> | Prisma.QuestionCreateWithoutUserInput[] | Prisma.QuestionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutUserInput | Prisma.QuestionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.QuestionCreateManyUserInputEnvelope;
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
};
export type QuestionUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutUserInput, Prisma.QuestionUncheckedCreateWithoutUserInput> | Prisma.QuestionCreateWithoutUserInput[] | Prisma.QuestionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutUserInput | Prisma.QuestionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.QuestionCreateManyUserInputEnvelope;
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
};
export type QuestionUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutUserInput, Prisma.QuestionUncheckedCreateWithoutUserInput> | Prisma.QuestionCreateWithoutUserInput[] | Prisma.QuestionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutUserInput | Prisma.QuestionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.QuestionUpsertWithWhereUniqueWithoutUserInput | Prisma.QuestionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.QuestionCreateManyUserInputEnvelope;
    set?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    disconnect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    delete?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    update?: Prisma.QuestionUpdateWithWhereUniqueWithoutUserInput | Prisma.QuestionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.QuestionUpdateManyWithWhereWithoutUserInput | Prisma.QuestionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.QuestionScalarWhereInput | Prisma.QuestionScalarWhereInput[];
};
export type QuestionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutUserInput, Prisma.QuestionUncheckedCreateWithoutUserInput> | Prisma.QuestionCreateWithoutUserInput[] | Prisma.QuestionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutUserInput | Prisma.QuestionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.QuestionUpsertWithWhereUniqueWithoutUserInput | Prisma.QuestionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.QuestionCreateManyUserInputEnvelope;
    set?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    disconnect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    delete?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    update?: Prisma.QuestionUpdateWithWhereUniqueWithoutUserInput | Prisma.QuestionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.QuestionUpdateManyWithWhereWithoutUserInput | Prisma.QuestionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.QuestionScalarWhereInput | Prisma.QuestionScalarWhereInput[];
};
export type QuestionCreateNestedManyWithoutSessionInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutSessionInput, Prisma.QuestionUncheckedCreateWithoutSessionInput> | Prisma.QuestionCreateWithoutSessionInput[] | Prisma.QuestionUncheckedCreateWithoutSessionInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutSessionInput | Prisma.QuestionCreateOrConnectWithoutSessionInput[];
    createMany?: Prisma.QuestionCreateManySessionInputEnvelope;
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
};
export type QuestionUncheckedCreateNestedManyWithoutSessionInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutSessionInput, Prisma.QuestionUncheckedCreateWithoutSessionInput> | Prisma.QuestionCreateWithoutSessionInput[] | Prisma.QuestionUncheckedCreateWithoutSessionInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutSessionInput | Prisma.QuestionCreateOrConnectWithoutSessionInput[];
    createMany?: Prisma.QuestionCreateManySessionInputEnvelope;
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
};
export type QuestionUpdateManyWithoutSessionNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutSessionInput, Prisma.QuestionUncheckedCreateWithoutSessionInput> | Prisma.QuestionCreateWithoutSessionInput[] | Prisma.QuestionUncheckedCreateWithoutSessionInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutSessionInput | Prisma.QuestionCreateOrConnectWithoutSessionInput[];
    upsert?: Prisma.QuestionUpsertWithWhereUniqueWithoutSessionInput | Prisma.QuestionUpsertWithWhereUniqueWithoutSessionInput[];
    createMany?: Prisma.QuestionCreateManySessionInputEnvelope;
    set?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    disconnect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    delete?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    update?: Prisma.QuestionUpdateWithWhereUniqueWithoutSessionInput | Prisma.QuestionUpdateWithWhereUniqueWithoutSessionInput[];
    updateMany?: Prisma.QuestionUpdateManyWithWhereWithoutSessionInput | Prisma.QuestionUpdateManyWithWhereWithoutSessionInput[];
    deleteMany?: Prisma.QuestionScalarWhereInput | Prisma.QuestionScalarWhereInput[];
};
export type QuestionUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: Prisma.XOR<Prisma.QuestionCreateWithoutSessionInput, Prisma.QuestionUncheckedCreateWithoutSessionInput> | Prisma.QuestionCreateWithoutSessionInput[] | Prisma.QuestionUncheckedCreateWithoutSessionInput[];
    connectOrCreate?: Prisma.QuestionCreateOrConnectWithoutSessionInput | Prisma.QuestionCreateOrConnectWithoutSessionInput[];
    upsert?: Prisma.QuestionUpsertWithWhereUniqueWithoutSessionInput | Prisma.QuestionUpsertWithWhereUniqueWithoutSessionInput[];
    createMany?: Prisma.QuestionCreateManySessionInputEnvelope;
    set?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    disconnect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    delete?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    connect?: Prisma.QuestionWhereUniqueInput | Prisma.QuestionWhereUniqueInput[];
    update?: Prisma.QuestionUpdateWithWhereUniqueWithoutSessionInput | Prisma.QuestionUpdateWithWhereUniqueWithoutSessionInput[];
    updateMany?: Prisma.QuestionUpdateManyWithWhereWithoutSessionInput | Prisma.QuestionUpdateManyWithWhereWithoutSessionInput[];
    deleteMany?: Prisma.QuestionScalarWhereInput | Prisma.QuestionScalarWhereInput[];
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type QuestionCreateWithoutUserInput = {
    id?: string;
    text: string;
    answer?: string | null;
    skipped?: boolean;
    order: number;
    Session?: Prisma.DailySessionCreateNestedOneWithoutQuestionsInput;
};
export type QuestionUncheckedCreateWithoutUserInput = {
    id?: string;
    sessionId: string;
    text: string;
    answer?: string | null;
    skipped?: boolean;
    order: number;
};
export type QuestionCreateOrConnectWithoutUserInput = {
    where: Prisma.QuestionWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuestionCreateWithoutUserInput, Prisma.QuestionUncheckedCreateWithoutUserInput>;
};
export type QuestionCreateManyUserInputEnvelope = {
    data: Prisma.QuestionCreateManyUserInput | Prisma.QuestionCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type QuestionUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.QuestionWhereUniqueInput;
    update: Prisma.XOR<Prisma.QuestionUpdateWithoutUserInput, Prisma.QuestionUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.QuestionCreateWithoutUserInput, Prisma.QuestionUncheckedCreateWithoutUserInput>;
};
export type QuestionUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.QuestionWhereUniqueInput;
    data: Prisma.XOR<Prisma.QuestionUpdateWithoutUserInput, Prisma.QuestionUncheckedUpdateWithoutUserInput>;
};
export type QuestionUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.QuestionScalarWhereInput;
    data: Prisma.XOR<Prisma.QuestionUpdateManyMutationInput, Prisma.QuestionUncheckedUpdateManyWithoutUserInput>;
};
export type QuestionScalarWhereInput = {
    AND?: Prisma.QuestionScalarWhereInput | Prisma.QuestionScalarWhereInput[];
    OR?: Prisma.QuestionScalarWhereInput[];
    NOT?: Prisma.QuestionScalarWhereInput | Prisma.QuestionScalarWhereInput[];
    id?: Prisma.StringFilter<"Question"> | string;
    sessionId?: Prisma.StringFilter<"Question"> | string;
    text?: Prisma.StringFilter<"Question"> | string;
    answer?: Prisma.StringNullableFilter<"Question"> | string | null;
    skipped?: Prisma.BoolFilter<"Question"> | boolean;
    order?: Prisma.IntFilter<"Question"> | number;
    userId?: Prisma.StringFilter<"Question"> | string;
};
export type QuestionCreateWithoutSessionInput = {
    id?: string;
    text: string;
    answer?: string | null;
    skipped?: boolean;
    order: number;
    User: Prisma.UserCreateNestedOneWithoutQuestionsInput;
};
export type QuestionUncheckedCreateWithoutSessionInput = {
    id?: string;
    text: string;
    answer?: string | null;
    skipped?: boolean;
    order: number;
    userId: string;
};
export type QuestionCreateOrConnectWithoutSessionInput = {
    where: Prisma.QuestionWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuestionCreateWithoutSessionInput, Prisma.QuestionUncheckedCreateWithoutSessionInput>;
};
export type QuestionCreateManySessionInputEnvelope = {
    data: Prisma.QuestionCreateManySessionInput | Prisma.QuestionCreateManySessionInput[];
    skipDuplicates?: boolean;
};
export type QuestionUpsertWithWhereUniqueWithoutSessionInput = {
    where: Prisma.QuestionWhereUniqueInput;
    update: Prisma.XOR<Prisma.QuestionUpdateWithoutSessionInput, Prisma.QuestionUncheckedUpdateWithoutSessionInput>;
    create: Prisma.XOR<Prisma.QuestionCreateWithoutSessionInput, Prisma.QuestionUncheckedCreateWithoutSessionInput>;
};
export type QuestionUpdateWithWhereUniqueWithoutSessionInput = {
    where: Prisma.QuestionWhereUniqueInput;
    data: Prisma.XOR<Prisma.QuestionUpdateWithoutSessionInput, Prisma.QuestionUncheckedUpdateWithoutSessionInput>;
};
export type QuestionUpdateManyWithWhereWithoutSessionInput = {
    where: Prisma.QuestionScalarWhereInput;
    data: Prisma.XOR<Prisma.QuestionUpdateManyMutationInput, Prisma.QuestionUncheckedUpdateManyWithoutSessionInput>;
};
export type QuestionCreateManyUserInput = {
    id?: string;
    sessionId: string;
    text: string;
    answer?: string | null;
    skipped?: boolean;
    order: number;
};
export type QuestionUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    answer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    skipped?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    Session?: Prisma.DailySessionUpdateOneWithoutQuestionsNestedInput;
};
export type QuestionUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionId?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    answer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    skipped?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type QuestionUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionId?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    answer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    skipped?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type QuestionCreateManySessionInput = {
    id?: string;
    text: string;
    answer?: string | null;
    skipped?: boolean;
    order: number;
    userId: string;
};
export type QuestionUpdateWithoutSessionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    answer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    skipped?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    User?: Prisma.UserUpdateOneRequiredWithoutQuestionsNestedInput;
};
export type QuestionUncheckedUpdateWithoutSessionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    answer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    skipped?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type QuestionUncheckedUpdateManyWithoutSessionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    answer?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    skipped?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type QuestionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sessionId?: boolean;
    text?: boolean;
    answer?: boolean;
    skipped?: boolean;
    order?: boolean;
    userId?: boolean;
    Session?: boolean | Prisma.Question$SessionArgs<ExtArgs>;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["question"]>;
export type QuestionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sessionId?: boolean;
    text?: boolean;
    answer?: boolean;
    skipped?: boolean;
    order?: boolean;
    userId?: boolean;
    Session?: boolean | Prisma.Question$SessionArgs<ExtArgs>;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["question"]>;
export type QuestionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sessionId?: boolean;
    text?: boolean;
    answer?: boolean;
    skipped?: boolean;
    order?: boolean;
    userId?: boolean;
    Session?: boolean | Prisma.Question$SessionArgs<ExtArgs>;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["question"]>;
export type QuestionSelectScalar = {
    id?: boolean;
    sessionId?: boolean;
    text?: boolean;
    answer?: boolean;
    skipped?: boolean;
    order?: boolean;
    userId?: boolean;
};
export type QuestionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "sessionId" | "text" | "answer" | "skipped" | "order" | "userId", ExtArgs["result"]["question"]>;
export type QuestionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    Session?: boolean | Prisma.Question$SessionArgs<ExtArgs>;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type QuestionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    Session?: boolean | Prisma.Question$SessionArgs<ExtArgs>;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type QuestionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    Session?: boolean | Prisma.Question$SessionArgs<ExtArgs>;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $QuestionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Question";
    objects: {
        Session: Prisma.$DailySessionPayload<ExtArgs> | null;
        User: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        sessionId: string;
        text: string;
        answer: string | null;
        skipped: boolean;
        order: number;
        userId: string;
    }, ExtArgs["result"]["question"]>;
    composites: {};
};
export type QuestionGetPayload<S extends boolean | null | undefined | QuestionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$QuestionPayload, S>;
export type QuestionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<QuestionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: QuestionCountAggregateInputType | true;
};
export interface QuestionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Question'];
        meta: {
            name: 'Question';
        };
    };
    findUnique<T extends QuestionFindUniqueArgs>(args: Prisma.SelectSubset<T, QuestionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends QuestionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, QuestionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends QuestionFindFirstArgs>(args?: Prisma.SelectSubset<T, QuestionFindFirstArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends QuestionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, QuestionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends QuestionFindManyArgs>(args?: Prisma.SelectSubset<T, QuestionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends QuestionCreateArgs>(args: Prisma.SelectSubset<T, QuestionCreateArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends QuestionCreateManyArgs>(args?: Prisma.SelectSubset<T, QuestionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends QuestionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, QuestionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends QuestionDeleteArgs>(args: Prisma.SelectSubset<T, QuestionDeleteArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends QuestionUpdateArgs>(args: Prisma.SelectSubset<T, QuestionUpdateArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends QuestionDeleteManyArgs>(args?: Prisma.SelectSubset<T, QuestionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends QuestionUpdateManyArgs>(args: Prisma.SelectSubset<T, QuestionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends QuestionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, QuestionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends QuestionUpsertArgs>(args: Prisma.SelectSubset<T, QuestionUpsertArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends QuestionCountArgs>(args?: Prisma.Subset<T, QuestionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], QuestionCountAggregateOutputType> : number>;
    aggregate<T extends QuestionAggregateArgs>(args: Prisma.Subset<T, QuestionAggregateArgs>): Prisma.PrismaPromise<GetQuestionAggregateType<T>>;
    groupBy<T extends QuestionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: QuestionGroupByArgs['orderBy'];
    } : {
        orderBy?: QuestionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, QuestionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: QuestionFieldRefs;
}
export interface Prisma__QuestionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    Session<T extends Prisma.Question$SessionArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Question$SessionArgs<ExtArgs>>): Prisma.Prisma__DailySessionClient<runtime.Types.Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    User<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface QuestionFieldRefs {
    readonly id: Prisma.FieldRef<"Question", 'String'>;
    readonly sessionId: Prisma.FieldRef<"Question", 'String'>;
    readonly text: Prisma.FieldRef<"Question", 'String'>;
    readonly answer: Prisma.FieldRef<"Question", 'String'>;
    readonly skipped: Prisma.FieldRef<"Question", 'Boolean'>;
    readonly order: Prisma.FieldRef<"Question", 'Int'>;
    readonly userId: Prisma.FieldRef<"Question", 'String'>;
}
export type QuestionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where: Prisma.QuestionWhereUniqueInput;
};
export type QuestionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where: Prisma.QuestionWhereUniqueInput;
};
export type QuestionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type QuestionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type QuestionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type QuestionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.QuestionCreateInput, Prisma.QuestionUncheckedCreateInput>;
};
export type QuestionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.QuestionCreateManyInput | Prisma.QuestionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type QuestionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    data: Prisma.QuestionCreateManyInput | Prisma.QuestionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.QuestionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type QuestionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.QuestionUpdateInput, Prisma.QuestionUncheckedUpdateInput>;
    where: Prisma.QuestionWhereUniqueInput;
};
export type QuestionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.QuestionUpdateManyMutationInput, Prisma.QuestionUncheckedUpdateManyInput>;
    where?: Prisma.QuestionWhereInput;
    limit?: number;
};
export type QuestionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.QuestionUpdateManyMutationInput, Prisma.QuestionUncheckedUpdateManyInput>;
    where?: Prisma.QuestionWhereInput;
    limit?: number;
    include?: Prisma.QuestionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type QuestionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where: Prisma.QuestionWhereUniqueInput;
    create: Prisma.XOR<Prisma.QuestionCreateInput, Prisma.QuestionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.QuestionUpdateInput, Prisma.QuestionUncheckedUpdateInput>;
};
export type QuestionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
    where: Prisma.QuestionWhereUniqueInput;
};
export type QuestionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuestionWhereInput;
    limit?: number;
};
export type Question$SessionArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DailySessionSelect<ExtArgs> | null;
    omit?: Prisma.DailySessionOmit<ExtArgs> | null;
    include?: Prisma.DailySessionInclude<ExtArgs> | null;
    where?: Prisma.DailySessionWhereInput;
};
export type QuestionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuestionSelect<ExtArgs> | null;
    omit?: Prisma.QuestionOmit<ExtArgs> | null;
    include?: Prisma.QuestionInclude<ExtArgs> | null;
};
