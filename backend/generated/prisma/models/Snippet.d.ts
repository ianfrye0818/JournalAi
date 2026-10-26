import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type SnippetModel = runtime.Types.Result.DefaultSelection<Prisma.$SnippetPayload>;
export type AggregateSnippet = {
    _count: SnippetCountAggregateOutputType | null;
    _min: SnippetMinAggregateOutputType | null;
    _max: SnippetMaxAggregateOutputType | null;
};
export type SnippetMinAggregateOutputType = {
    id: string | null;
    text: string | null;
    source: string | null;
    capturedAt: Date | null;
    clientId: string | null;
    mediaUrl: string | null;
    sessionId: string | null;
    userId: string | null;
};
export type SnippetMaxAggregateOutputType = {
    id: string | null;
    text: string | null;
    source: string | null;
    capturedAt: Date | null;
    clientId: string | null;
    mediaUrl: string | null;
    sessionId: string | null;
    userId: string | null;
};
export type SnippetCountAggregateOutputType = {
    id: number;
    text: number;
    source: number;
    capturedAt: number;
    clientId: number;
    mediaUrl: number;
    sessionId: number;
    userId: number;
    _all: number;
};
export type SnippetMinAggregateInputType = {
    id?: true;
    text?: true;
    source?: true;
    capturedAt?: true;
    clientId?: true;
    mediaUrl?: true;
    sessionId?: true;
    userId?: true;
};
export type SnippetMaxAggregateInputType = {
    id?: true;
    text?: true;
    source?: true;
    capturedAt?: true;
    clientId?: true;
    mediaUrl?: true;
    sessionId?: true;
    userId?: true;
};
export type SnippetCountAggregateInputType = {
    id?: true;
    text?: true;
    source?: true;
    capturedAt?: true;
    clientId?: true;
    mediaUrl?: true;
    sessionId?: true;
    userId?: true;
    _all?: true;
};
export type SnippetAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SnippetWhereInput;
    orderBy?: Prisma.SnippetOrderByWithRelationInput | Prisma.SnippetOrderByWithRelationInput[];
    cursor?: Prisma.SnippetWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SnippetCountAggregateInputType;
    _min?: SnippetMinAggregateInputType;
    _max?: SnippetMaxAggregateInputType;
};
export type GetSnippetAggregateType<T extends SnippetAggregateArgs> = {
    [P in keyof T & keyof AggregateSnippet]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSnippet[P]> : Prisma.GetScalarType<T[P], AggregateSnippet[P]>;
};
export type SnippetGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SnippetWhereInput;
    orderBy?: Prisma.SnippetOrderByWithAggregationInput | Prisma.SnippetOrderByWithAggregationInput[];
    by: Prisma.SnippetScalarFieldEnum[] | Prisma.SnippetScalarFieldEnum;
    having?: Prisma.SnippetScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SnippetCountAggregateInputType | true;
    _min?: SnippetMinAggregateInputType;
    _max?: SnippetMaxAggregateInputType;
};
export type SnippetGroupByOutputType = {
    id: string;
    text: string;
    source: string;
    capturedAt: Date;
    clientId: string;
    mediaUrl: string | null;
    sessionId: string | null;
    userId: string;
    _count: SnippetCountAggregateOutputType | null;
    _min: SnippetMinAggregateOutputType | null;
    _max: SnippetMaxAggregateOutputType | null;
};
export type GetSnippetGroupByPayload<T extends SnippetGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SnippetGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SnippetGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SnippetGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SnippetGroupByOutputType[P]>;
}>>;
export type SnippetWhereInput = {
    AND?: Prisma.SnippetWhereInput | Prisma.SnippetWhereInput[];
    OR?: Prisma.SnippetWhereInput[];
    NOT?: Prisma.SnippetWhereInput | Prisma.SnippetWhereInput[];
    id?: Prisma.StringFilter<"Snippet"> | string;
    text?: Prisma.StringFilter<"Snippet"> | string;
    source?: Prisma.StringFilter<"Snippet"> | string;
    capturedAt?: Prisma.DateTimeFilter<"Snippet"> | Date | string;
    clientId?: Prisma.StringFilter<"Snippet"> | string;
    mediaUrl?: Prisma.StringNullableFilter<"Snippet"> | string | null;
    sessionId?: Prisma.StringNullableFilter<"Snippet"> | string | null;
    userId?: Prisma.StringFilter<"Snippet"> | string;
    User?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    Session?: Prisma.XOR<Prisma.DailySessionNullableScalarRelationFilter, Prisma.DailySessionWhereInput> | null;
};
export type SnippetOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    clientId?: Prisma.SortOrder;
    mediaUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    sessionId?: Prisma.SortOrderInput | Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    User?: Prisma.UserOrderByWithRelationInput;
    Session?: Prisma.DailySessionOrderByWithRelationInput;
};
export type SnippetWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    clientId?: string;
    AND?: Prisma.SnippetWhereInput | Prisma.SnippetWhereInput[];
    OR?: Prisma.SnippetWhereInput[];
    NOT?: Prisma.SnippetWhereInput | Prisma.SnippetWhereInput[];
    text?: Prisma.StringFilter<"Snippet"> | string;
    source?: Prisma.StringFilter<"Snippet"> | string;
    capturedAt?: Prisma.DateTimeFilter<"Snippet"> | Date | string;
    mediaUrl?: Prisma.StringNullableFilter<"Snippet"> | string | null;
    sessionId?: Prisma.StringNullableFilter<"Snippet"> | string | null;
    userId?: Prisma.StringFilter<"Snippet"> | string;
    User?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    Session?: Prisma.XOR<Prisma.DailySessionNullableScalarRelationFilter, Prisma.DailySessionWhereInput> | null;
}, "id" | "clientId">;
export type SnippetOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    clientId?: Prisma.SortOrder;
    mediaUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    sessionId?: Prisma.SortOrderInput | Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    _count?: Prisma.SnippetCountOrderByAggregateInput;
    _max?: Prisma.SnippetMaxOrderByAggregateInput;
    _min?: Prisma.SnippetMinOrderByAggregateInput;
};
export type SnippetScalarWhereWithAggregatesInput = {
    AND?: Prisma.SnippetScalarWhereWithAggregatesInput | Prisma.SnippetScalarWhereWithAggregatesInput[];
    OR?: Prisma.SnippetScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SnippetScalarWhereWithAggregatesInput | Prisma.SnippetScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Snippet"> | string;
    text?: Prisma.StringWithAggregatesFilter<"Snippet"> | string;
    source?: Prisma.StringWithAggregatesFilter<"Snippet"> | string;
    capturedAt?: Prisma.DateTimeWithAggregatesFilter<"Snippet"> | Date | string;
    clientId?: Prisma.StringWithAggregatesFilter<"Snippet"> | string;
    mediaUrl?: Prisma.StringNullableWithAggregatesFilter<"Snippet"> | string | null;
    sessionId?: Prisma.StringNullableWithAggregatesFilter<"Snippet"> | string | null;
    userId?: Prisma.StringWithAggregatesFilter<"Snippet"> | string;
};
export type SnippetCreateInput = {
    id?: string;
    text: string;
    source?: string;
    capturedAt?: Date | string;
    clientId: string;
    mediaUrl?: string | null;
    User: Prisma.UserCreateNestedOneWithoutSnippetsInput;
    Session?: Prisma.DailySessionCreateNestedOneWithoutSnippetsInput;
};
export type SnippetUncheckedCreateInput = {
    id?: string;
    text: string;
    source?: string;
    capturedAt?: Date | string;
    clientId: string;
    mediaUrl?: string | null;
    sessionId?: string | null;
    userId: string;
};
export type SnippetUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clientId?: Prisma.StringFieldUpdateOperationsInput | string;
    mediaUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    User?: Prisma.UserUpdateOneRequiredWithoutSnippetsNestedInput;
    Session?: Prisma.DailySessionUpdateOneWithoutSnippetsNestedInput;
};
export type SnippetUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clientId?: Prisma.StringFieldUpdateOperationsInput | string;
    mediaUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sessionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type SnippetCreateManyInput = {
    id?: string;
    text: string;
    source?: string;
    capturedAt?: Date | string;
    clientId: string;
    mediaUrl?: string | null;
    sessionId?: string | null;
    userId: string;
};
export type SnippetUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clientId?: Prisma.StringFieldUpdateOperationsInput | string;
    mediaUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type SnippetUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clientId?: Prisma.StringFieldUpdateOperationsInput | string;
    mediaUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sessionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type SnippetListRelationFilter = {
    every?: Prisma.SnippetWhereInput;
    some?: Prisma.SnippetWhereInput;
    none?: Prisma.SnippetWhereInput;
};
export type SnippetOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SnippetCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    clientId?: Prisma.SortOrder;
    mediaUrl?: Prisma.SortOrder;
    sessionId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type SnippetMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    clientId?: Prisma.SortOrder;
    mediaUrl?: Prisma.SortOrder;
    sessionId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type SnippetMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    text?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    clientId?: Prisma.SortOrder;
    mediaUrl?: Prisma.SortOrder;
    sessionId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type SnippetCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SnippetCreateWithoutUserInput, Prisma.SnippetUncheckedCreateWithoutUserInput> | Prisma.SnippetCreateWithoutUserInput[] | Prisma.SnippetUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SnippetCreateOrConnectWithoutUserInput | Prisma.SnippetCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SnippetCreateManyUserInputEnvelope;
    connect?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
};
export type SnippetUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SnippetCreateWithoutUserInput, Prisma.SnippetUncheckedCreateWithoutUserInput> | Prisma.SnippetCreateWithoutUserInput[] | Prisma.SnippetUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SnippetCreateOrConnectWithoutUserInput | Prisma.SnippetCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SnippetCreateManyUserInputEnvelope;
    connect?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
};
export type SnippetUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SnippetCreateWithoutUserInput, Prisma.SnippetUncheckedCreateWithoutUserInput> | Prisma.SnippetCreateWithoutUserInput[] | Prisma.SnippetUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SnippetCreateOrConnectWithoutUserInput | Prisma.SnippetCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SnippetUpsertWithWhereUniqueWithoutUserInput | Prisma.SnippetUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SnippetCreateManyUserInputEnvelope;
    set?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
    disconnect?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
    delete?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
    connect?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
    update?: Prisma.SnippetUpdateWithWhereUniqueWithoutUserInput | Prisma.SnippetUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SnippetUpdateManyWithWhereWithoutUserInput | Prisma.SnippetUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SnippetScalarWhereInput | Prisma.SnippetScalarWhereInput[];
};
export type SnippetUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SnippetCreateWithoutUserInput, Prisma.SnippetUncheckedCreateWithoutUserInput> | Prisma.SnippetCreateWithoutUserInput[] | Prisma.SnippetUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SnippetCreateOrConnectWithoutUserInput | Prisma.SnippetCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SnippetUpsertWithWhereUniqueWithoutUserInput | Prisma.SnippetUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SnippetCreateManyUserInputEnvelope;
    set?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
    disconnect?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
    delete?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
    connect?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
    update?: Prisma.SnippetUpdateWithWhereUniqueWithoutUserInput | Prisma.SnippetUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SnippetUpdateManyWithWhereWithoutUserInput | Prisma.SnippetUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SnippetScalarWhereInput | Prisma.SnippetScalarWhereInput[];
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type SnippetCreateNestedManyWithoutSessionInput = {
    create?: Prisma.XOR<Prisma.SnippetCreateWithoutSessionInput, Prisma.SnippetUncheckedCreateWithoutSessionInput> | Prisma.SnippetCreateWithoutSessionInput[] | Prisma.SnippetUncheckedCreateWithoutSessionInput[];
    connectOrCreate?: Prisma.SnippetCreateOrConnectWithoutSessionInput | Prisma.SnippetCreateOrConnectWithoutSessionInput[];
    createMany?: Prisma.SnippetCreateManySessionInputEnvelope;
    connect?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
};
export type SnippetUncheckedCreateNestedManyWithoutSessionInput = {
    create?: Prisma.XOR<Prisma.SnippetCreateWithoutSessionInput, Prisma.SnippetUncheckedCreateWithoutSessionInput> | Prisma.SnippetCreateWithoutSessionInput[] | Prisma.SnippetUncheckedCreateWithoutSessionInput[];
    connectOrCreate?: Prisma.SnippetCreateOrConnectWithoutSessionInput | Prisma.SnippetCreateOrConnectWithoutSessionInput[];
    createMany?: Prisma.SnippetCreateManySessionInputEnvelope;
    connect?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
};
export type SnippetUpdateManyWithoutSessionNestedInput = {
    create?: Prisma.XOR<Prisma.SnippetCreateWithoutSessionInput, Prisma.SnippetUncheckedCreateWithoutSessionInput> | Prisma.SnippetCreateWithoutSessionInput[] | Prisma.SnippetUncheckedCreateWithoutSessionInput[];
    connectOrCreate?: Prisma.SnippetCreateOrConnectWithoutSessionInput | Prisma.SnippetCreateOrConnectWithoutSessionInput[];
    upsert?: Prisma.SnippetUpsertWithWhereUniqueWithoutSessionInput | Prisma.SnippetUpsertWithWhereUniqueWithoutSessionInput[];
    createMany?: Prisma.SnippetCreateManySessionInputEnvelope;
    set?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
    disconnect?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
    delete?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
    connect?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
    update?: Prisma.SnippetUpdateWithWhereUniqueWithoutSessionInput | Prisma.SnippetUpdateWithWhereUniqueWithoutSessionInput[];
    updateMany?: Prisma.SnippetUpdateManyWithWhereWithoutSessionInput | Prisma.SnippetUpdateManyWithWhereWithoutSessionInput[];
    deleteMany?: Prisma.SnippetScalarWhereInput | Prisma.SnippetScalarWhereInput[];
};
export type SnippetUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: Prisma.XOR<Prisma.SnippetCreateWithoutSessionInput, Prisma.SnippetUncheckedCreateWithoutSessionInput> | Prisma.SnippetCreateWithoutSessionInput[] | Prisma.SnippetUncheckedCreateWithoutSessionInput[];
    connectOrCreate?: Prisma.SnippetCreateOrConnectWithoutSessionInput | Prisma.SnippetCreateOrConnectWithoutSessionInput[];
    upsert?: Prisma.SnippetUpsertWithWhereUniqueWithoutSessionInput | Prisma.SnippetUpsertWithWhereUniqueWithoutSessionInput[];
    createMany?: Prisma.SnippetCreateManySessionInputEnvelope;
    set?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
    disconnect?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
    delete?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
    connect?: Prisma.SnippetWhereUniqueInput | Prisma.SnippetWhereUniqueInput[];
    update?: Prisma.SnippetUpdateWithWhereUniqueWithoutSessionInput | Prisma.SnippetUpdateWithWhereUniqueWithoutSessionInput[];
    updateMany?: Prisma.SnippetUpdateManyWithWhereWithoutSessionInput | Prisma.SnippetUpdateManyWithWhereWithoutSessionInput[];
    deleteMany?: Prisma.SnippetScalarWhereInput | Prisma.SnippetScalarWhereInput[];
};
export type SnippetCreateWithoutUserInput = {
    id?: string;
    text: string;
    source?: string;
    capturedAt?: Date | string;
    clientId: string;
    mediaUrl?: string | null;
    Session?: Prisma.DailySessionCreateNestedOneWithoutSnippetsInput;
};
export type SnippetUncheckedCreateWithoutUserInput = {
    id?: string;
    text: string;
    source?: string;
    capturedAt?: Date | string;
    clientId: string;
    mediaUrl?: string | null;
    sessionId?: string | null;
};
export type SnippetCreateOrConnectWithoutUserInput = {
    where: Prisma.SnippetWhereUniqueInput;
    create: Prisma.XOR<Prisma.SnippetCreateWithoutUserInput, Prisma.SnippetUncheckedCreateWithoutUserInput>;
};
export type SnippetCreateManyUserInputEnvelope = {
    data: Prisma.SnippetCreateManyUserInput | Prisma.SnippetCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type SnippetUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.SnippetWhereUniqueInput;
    update: Prisma.XOR<Prisma.SnippetUpdateWithoutUserInput, Prisma.SnippetUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.SnippetCreateWithoutUserInput, Prisma.SnippetUncheckedCreateWithoutUserInput>;
};
export type SnippetUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.SnippetWhereUniqueInput;
    data: Prisma.XOR<Prisma.SnippetUpdateWithoutUserInput, Prisma.SnippetUncheckedUpdateWithoutUserInput>;
};
export type SnippetUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.SnippetScalarWhereInput;
    data: Prisma.XOR<Prisma.SnippetUpdateManyMutationInput, Prisma.SnippetUncheckedUpdateManyWithoutUserInput>;
};
export type SnippetScalarWhereInput = {
    AND?: Prisma.SnippetScalarWhereInput | Prisma.SnippetScalarWhereInput[];
    OR?: Prisma.SnippetScalarWhereInput[];
    NOT?: Prisma.SnippetScalarWhereInput | Prisma.SnippetScalarWhereInput[];
    id?: Prisma.StringFilter<"Snippet"> | string;
    text?: Prisma.StringFilter<"Snippet"> | string;
    source?: Prisma.StringFilter<"Snippet"> | string;
    capturedAt?: Prisma.DateTimeFilter<"Snippet"> | Date | string;
    clientId?: Prisma.StringFilter<"Snippet"> | string;
    mediaUrl?: Prisma.StringNullableFilter<"Snippet"> | string | null;
    sessionId?: Prisma.StringNullableFilter<"Snippet"> | string | null;
    userId?: Prisma.StringFilter<"Snippet"> | string;
};
export type SnippetCreateWithoutSessionInput = {
    id?: string;
    text: string;
    source?: string;
    capturedAt?: Date | string;
    clientId: string;
    mediaUrl?: string | null;
    User: Prisma.UserCreateNestedOneWithoutSnippetsInput;
};
export type SnippetUncheckedCreateWithoutSessionInput = {
    id?: string;
    text: string;
    source?: string;
    capturedAt?: Date | string;
    clientId: string;
    mediaUrl?: string | null;
    userId: string;
};
export type SnippetCreateOrConnectWithoutSessionInput = {
    where: Prisma.SnippetWhereUniqueInput;
    create: Prisma.XOR<Prisma.SnippetCreateWithoutSessionInput, Prisma.SnippetUncheckedCreateWithoutSessionInput>;
};
export type SnippetCreateManySessionInputEnvelope = {
    data: Prisma.SnippetCreateManySessionInput | Prisma.SnippetCreateManySessionInput[];
    skipDuplicates?: boolean;
};
export type SnippetUpsertWithWhereUniqueWithoutSessionInput = {
    where: Prisma.SnippetWhereUniqueInput;
    update: Prisma.XOR<Prisma.SnippetUpdateWithoutSessionInput, Prisma.SnippetUncheckedUpdateWithoutSessionInput>;
    create: Prisma.XOR<Prisma.SnippetCreateWithoutSessionInput, Prisma.SnippetUncheckedCreateWithoutSessionInput>;
};
export type SnippetUpdateWithWhereUniqueWithoutSessionInput = {
    where: Prisma.SnippetWhereUniqueInput;
    data: Prisma.XOR<Prisma.SnippetUpdateWithoutSessionInput, Prisma.SnippetUncheckedUpdateWithoutSessionInput>;
};
export type SnippetUpdateManyWithWhereWithoutSessionInput = {
    where: Prisma.SnippetScalarWhereInput;
    data: Prisma.XOR<Prisma.SnippetUpdateManyMutationInput, Prisma.SnippetUncheckedUpdateManyWithoutSessionInput>;
};
export type SnippetCreateManyUserInput = {
    id?: string;
    text: string;
    source?: string;
    capturedAt?: Date | string;
    clientId: string;
    mediaUrl?: string | null;
    sessionId?: string | null;
};
export type SnippetUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clientId?: Prisma.StringFieldUpdateOperationsInput | string;
    mediaUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    Session?: Prisma.DailySessionUpdateOneWithoutSnippetsNestedInput;
};
export type SnippetUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clientId?: Prisma.StringFieldUpdateOperationsInput | string;
    mediaUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sessionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type SnippetUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clientId?: Prisma.StringFieldUpdateOperationsInput | string;
    mediaUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sessionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type SnippetCreateManySessionInput = {
    id?: string;
    text: string;
    source?: string;
    capturedAt?: Date | string;
    clientId: string;
    mediaUrl?: string | null;
    userId: string;
};
export type SnippetUpdateWithoutSessionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clientId?: Prisma.StringFieldUpdateOperationsInput | string;
    mediaUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    User?: Prisma.UserUpdateOneRequiredWithoutSnippetsNestedInput;
};
export type SnippetUncheckedUpdateWithoutSessionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clientId?: Prisma.StringFieldUpdateOperationsInput | string;
    mediaUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type SnippetUncheckedUpdateManyWithoutSessionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    text?: Prisma.StringFieldUpdateOperationsInput | string;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    clientId?: Prisma.StringFieldUpdateOperationsInput | string;
    mediaUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type SnippetSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    text?: boolean;
    source?: boolean;
    capturedAt?: boolean;
    clientId?: boolean;
    mediaUrl?: boolean;
    sessionId?: boolean;
    userId?: boolean;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    Session?: boolean | Prisma.Snippet$SessionArgs<ExtArgs>;
}, ExtArgs["result"]["snippet"]>;
export type SnippetSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    text?: boolean;
    source?: boolean;
    capturedAt?: boolean;
    clientId?: boolean;
    mediaUrl?: boolean;
    sessionId?: boolean;
    userId?: boolean;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    Session?: boolean | Prisma.Snippet$SessionArgs<ExtArgs>;
}, ExtArgs["result"]["snippet"]>;
export type SnippetSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    text?: boolean;
    source?: boolean;
    capturedAt?: boolean;
    clientId?: boolean;
    mediaUrl?: boolean;
    sessionId?: boolean;
    userId?: boolean;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    Session?: boolean | Prisma.Snippet$SessionArgs<ExtArgs>;
}, ExtArgs["result"]["snippet"]>;
export type SnippetSelectScalar = {
    id?: boolean;
    text?: boolean;
    source?: boolean;
    capturedAt?: boolean;
    clientId?: boolean;
    mediaUrl?: boolean;
    sessionId?: boolean;
    userId?: boolean;
};
export type SnippetOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "text" | "source" | "capturedAt" | "clientId" | "mediaUrl" | "sessionId" | "userId", ExtArgs["result"]["snippet"]>;
export type SnippetInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    Session?: boolean | Prisma.Snippet$SessionArgs<ExtArgs>;
};
export type SnippetIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    Session?: boolean | Prisma.Snippet$SessionArgs<ExtArgs>;
};
export type SnippetIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    Session?: boolean | Prisma.Snippet$SessionArgs<ExtArgs>;
};
export type $SnippetPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Snippet";
    objects: {
        User: Prisma.$UserPayload<ExtArgs>;
        Session: Prisma.$DailySessionPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        text: string;
        source: string;
        capturedAt: Date;
        clientId: string;
        mediaUrl: string | null;
        sessionId: string | null;
        userId: string;
    }, ExtArgs["result"]["snippet"]>;
    composites: {};
};
export type SnippetGetPayload<S extends boolean | null | undefined | SnippetDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SnippetPayload, S>;
export type SnippetCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SnippetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SnippetCountAggregateInputType | true;
};
export interface SnippetDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Snippet'];
        meta: {
            name: 'Snippet';
        };
    };
    findUnique<T extends SnippetFindUniqueArgs>(args: Prisma.SelectSubset<T, SnippetFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SnippetClient<runtime.Types.Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SnippetFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SnippetFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SnippetClient<runtime.Types.Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SnippetFindFirstArgs>(args?: Prisma.SelectSubset<T, SnippetFindFirstArgs<ExtArgs>>): Prisma.Prisma__SnippetClient<runtime.Types.Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SnippetFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SnippetFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SnippetClient<runtime.Types.Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SnippetFindManyArgs>(args?: Prisma.SelectSubset<T, SnippetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SnippetCreateArgs>(args: Prisma.SelectSubset<T, SnippetCreateArgs<ExtArgs>>): Prisma.Prisma__SnippetClient<runtime.Types.Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SnippetCreateManyArgs>(args?: Prisma.SelectSubset<T, SnippetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SnippetCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SnippetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SnippetDeleteArgs>(args: Prisma.SelectSubset<T, SnippetDeleteArgs<ExtArgs>>): Prisma.Prisma__SnippetClient<runtime.Types.Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SnippetUpdateArgs>(args: Prisma.SelectSubset<T, SnippetUpdateArgs<ExtArgs>>): Prisma.Prisma__SnippetClient<runtime.Types.Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SnippetDeleteManyArgs>(args?: Prisma.SelectSubset<T, SnippetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SnippetUpdateManyArgs>(args: Prisma.SelectSubset<T, SnippetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SnippetUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SnippetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SnippetUpsertArgs>(args: Prisma.SelectSubset<T, SnippetUpsertArgs<ExtArgs>>): Prisma.Prisma__SnippetClient<runtime.Types.Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SnippetCountArgs>(args?: Prisma.Subset<T, SnippetCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SnippetCountAggregateOutputType> : number>;
    aggregate<T extends SnippetAggregateArgs>(args: Prisma.Subset<T, SnippetAggregateArgs>): Prisma.PrismaPromise<GetSnippetAggregateType<T>>;
    groupBy<T extends SnippetGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SnippetGroupByArgs['orderBy'];
    } : {
        orderBy?: SnippetGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SnippetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSnippetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SnippetFieldRefs;
}
export interface Prisma__SnippetClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    User<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    Session<T extends Prisma.Snippet$SessionArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Snippet$SessionArgs<ExtArgs>>): Prisma.Prisma__DailySessionClient<runtime.Types.Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SnippetFieldRefs {
    readonly id: Prisma.FieldRef<"Snippet", 'String'>;
    readonly text: Prisma.FieldRef<"Snippet", 'String'>;
    readonly source: Prisma.FieldRef<"Snippet", 'String'>;
    readonly capturedAt: Prisma.FieldRef<"Snippet", 'DateTime'>;
    readonly clientId: Prisma.FieldRef<"Snippet", 'String'>;
    readonly mediaUrl: Prisma.FieldRef<"Snippet", 'String'>;
    readonly sessionId: Prisma.FieldRef<"Snippet", 'String'>;
    readonly userId: Prisma.FieldRef<"Snippet", 'String'>;
}
export type SnippetFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SnippetSelect<ExtArgs> | null;
    omit?: Prisma.SnippetOmit<ExtArgs> | null;
    include?: Prisma.SnippetInclude<ExtArgs> | null;
    where: Prisma.SnippetWhereUniqueInput;
};
export type SnippetFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SnippetSelect<ExtArgs> | null;
    omit?: Prisma.SnippetOmit<ExtArgs> | null;
    include?: Prisma.SnippetInclude<ExtArgs> | null;
    where: Prisma.SnippetWhereUniqueInput;
};
export type SnippetFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SnippetFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SnippetFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SnippetCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SnippetSelect<ExtArgs> | null;
    omit?: Prisma.SnippetOmit<ExtArgs> | null;
    include?: Prisma.SnippetInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SnippetCreateInput, Prisma.SnippetUncheckedCreateInput>;
};
export type SnippetCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SnippetCreateManyInput | Prisma.SnippetCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SnippetCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SnippetSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SnippetOmit<ExtArgs> | null;
    data: Prisma.SnippetCreateManyInput | Prisma.SnippetCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SnippetIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SnippetUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SnippetSelect<ExtArgs> | null;
    omit?: Prisma.SnippetOmit<ExtArgs> | null;
    include?: Prisma.SnippetInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SnippetUpdateInput, Prisma.SnippetUncheckedUpdateInput>;
    where: Prisma.SnippetWhereUniqueInput;
};
export type SnippetUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SnippetUpdateManyMutationInput, Prisma.SnippetUncheckedUpdateManyInput>;
    where?: Prisma.SnippetWhereInput;
    limit?: number;
};
export type SnippetUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SnippetSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SnippetOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SnippetUpdateManyMutationInput, Prisma.SnippetUncheckedUpdateManyInput>;
    where?: Prisma.SnippetWhereInput;
    limit?: number;
    include?: Prisma.SnippetIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SnippetUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SnippetSelect<ExtArgs> | null;
    omit?: Prisma.SnippetOmit<ExtArgs> | null;
    include?: Prisma.SnippetInclude<ExtArgs> | null;
    where: Prisma.SnippetWhereUniqueInput;
    create: Prisma.XOR<Prisma.SnippetCreateInput, Prisma.SnippetUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SnippetUpdateInput, Prisma.SnippetUncheckedUpdateInput>;
};
export type SnippetDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SnippetSelect<ExtArgs> | null;
    omit?: Prisma.SnippetOmit<ExtArgs> | null;
    include?: Prisma.SnippetInclude<ExtArgs> | null;
    where: Prisma.SnippetWhereUniqueInput;
};
export type SnippetDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SnippetWhereInput;
    limit?: number;
};
export type Snippet$SessionArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DailySessionSelect<ExtArgs> | null;
    omit?: Prisma.DailySessionOmit<ExtArgs> | null;
    include?: Prisma.DailySessionInclude<ExtArgs> | null;
    where?: Prisma.DailySessionWhereInput;
};
export type SnippetDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SnippetSelect<ExtArgs> | null;
    omit?: Prisma.SnippetOmit<ExtArgs> | null;
    include?: Prisma.SnippetInclude<ExtArgs> | null;
};
