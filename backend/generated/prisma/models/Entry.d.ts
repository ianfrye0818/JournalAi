import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EntryModel = runtime.Types.Result.DefaultSelection<Prisma.$EntryPayload>;
export type AggregateEntry = {
    _count: EntryCountAggregateOutputType | null;
    _min: EntryMinAggregateOutputType | null;
    _max: EntryMaxAggregateOutputType | null;
};
export type EntryMinAggregateOutputType = {
    id: string | null;
    sessionId: string | null;
    body: string | null;
    aiDraft: string | null;
    updatedAt: Date | null;
    userId: string | null;
};
export type EntryMaxAggregateOutputType = {
    id: string | null;
    sessionId: string | null;
    body: string | null;
    aiDraft: string | null;
    updatedAt: Date | null;
    userId: string | null;
};
export type EntryCountAggregateOutputType = {
    id: number;
    sessionId: number;
    body: number;
    aiDraft: number;
    flags: number;
    updatedAt: number;
    userId: number;
    _all: number;
};
export type EntryMinAggregateInputType = {
    id?: true;
    sessionId?: true;
    body?: true;
    aiDraft?: true;
    updatedAt?: true;
    userId?: true;
};
export type EntryMaxAggregateInputType = {
    id?: true;
    sessionId?: true;
    body?: true;
    aiDraft?: true;
    updatedAt?: true;
    userId?: true;
};
export type EntryCountAggregateInputType = {
    id?: true;
    sessionId?: true;
    body?: true;
    aiDraft?: true;
    flags?: true;
    updatedAt?: true;
    userId?: true;
    _all?: true;
};
export type EntryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EntryWhereInput;
    orderBy?: Prisma.EntryOrderByWithRelationInput | Prisma.EntryOrderByWithRelationInput[];
    cursor?: Prisma.EntryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EntryCountAggregateInputType;
    _min?: EntryMinAggregateInputType;
    _max?: EntryMaxAggregateInputType;
};
export type GetEntryAggregateType<T extends EntryAggregateArgs> = {
    [P in keyof T & keyof AggregateEntry]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEntry[P]> : Prisma.GetScalarType<T[P], AggregateEntry[P]>;
};
export type EntryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EntryWhereInput;
    orderBy?: Prisma.EntryOrderByWithAggregationInput | Prisma.EntryOrderByWithAggregationInput[];
    by: Prisma.EntryScalarFieldEnum[] | Prisma.EntryScalarFieldEnum;
    having?: Prisma.EntryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EntryCountAggregateInputType | true;
    _min?: EntryMinAggregateInputType;
    _max?: EntryMaxAggregateInputType;
};
export type EntryGroupByOutputType = {
    id: string;
    sessionId: string;
    body: string;
    aiDraft: string;
    flags: runtime.JsonValue | null;
    updatedAt: Date;
    userId: string;
    _count: EntryCountAggregateOutputType | null;
    _min: EntryMinAggregateOutputType | null;
    _max: EntryMaxAggregateOutputType | null;
};
export type GetEntryGroupByPayload<T extends EntryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EntryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EntryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EntryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EntryGroupByOutputType[P]>;
}>>;
export type EntryWhereInput = {
    AND?: Prisma.EntryWhereInput | Prisma.EntryWhereInput[];
    OR?: Prisma.EntryWhereInput[];
    NOT?: Prisma.EntryWhereInput | Prisma.EntryWhereInput[];
    id?: Prisma.StringFilter<"Entry"> | string;
    sessionId?: Prisma.StringFilter<"Entry"> | string;
    body?: Prisma.StringFilter<"Entry"> | string;
    aiDraft?: Prisma.StringFilter<"Entry"> | string;
    flags?: Prisma.JsonNullableFilter<"Entry">;
    updatedAt?: Prisma.DateTimeFilter<"Entry"> | Date | string;
    userId?: Prisma.StringFilter<"Entry"> | string;
    Session?: Prisma.XOR<Prisma.DailySessionNullableScalarRelationFilter, Prisma.DailySessionWhereInput> | null;
    User?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type EntryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    sessionId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    aiDraft?: Prisma.SortOrder;
    flags?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    Session?: Prisma.DailySessionOrderByWithRelationInput;
    User?: Prisma.UserOrderByWithRelationInput;
};
export type EntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    sessionId?: string;
    AND?: Prisma.EntryWhereInput | Prisma.EntryWhereInput[];
    OR?: Prisma.EntryWhereInput[];
    NOT?: Prisma.EntryWhereInput | Prisma.EntryWhereInput[];
    body?: Prisma.StringFilter<"Entry"> | string;
    aiDraft?: Prisma.StringFilter<"Entry"> | string;
    flags?: Prisma.JsonNullableFilter<"Entry">;
    updatedAt?: Prisma.DateTimeFilter<"Entry"> | Date | string;
    userId?: Prisma.StringFilter<"Entry"> | string;
    Session?: Prisma.XOR<Prisma.DailySessionNullableScalarRelationFilter, Prisma.DailySessionWhereInput> | null;
    User?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "sessionId">;
export type EntryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    sessionId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    aiDraft?: Prisma.SortOrder;
    flags?: Prisma.SortOrderInput | Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    _count?: Prisma.EntryCountOrderByAggregateInput;
    _max?: Prisma.EntryMaxOrderByAggregateInput;
    _min?: Prisma.EntryMinOrderByAggregateInput;
};
export type EntryScalarWhereWithAggregatesInput = {
    AND?: Prisma.EntryScalarWhereWithAggregatesInput | Prisma.EntryScalarWhereWithAggregatesInput[];
    OR?: Prisma.EntryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EntryScalarWhereWithAggregatesInput | Prisma.EntryScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Entry"> | string;
    sessionId?: Prisma.StringWithAggregatesFilter<"Entry"> | string;
    body?: Prisma.StringWithAggregatesFilter<"Entry"> | string;
    aiDraft?: Prisma.StringWithAggregatesFilter<"Entry"> | string;
    flags?: Prisma.JsonNullableWithAggregatesFilter<"Entry">;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Entry"> | Date | string;
    userId?: Prisma.StringWithAggregatesFilter<"Entry"> | string;
};
export type EntryCreateInput = {
    id?: string;
    body: string;
    aiDraft: string;
    flags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Date | string;
    Session?: Prisma.DailySessionCreateNestedOneWithoutEntryInput;
    User: Prisma.UserCreateNestedOneWithoutEntriesInput;
};
export type EntryUncheckedCreateInput = {
    id?: string;
    sessionId: string;
    body: string;
    aiDraft: string;
    flags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Date | string;
    userId: string;
};
export type EntryUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    aiDraft?: Prisma.StringFieldUpdateOperationsInput | string;
    flags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    Session?: Prisma.DailySessionUpdateOneWithoutEntryNestedInput;
    User?: Prisma.UserUpdateOneRequiredWithoutEntriesNestedInput;
};
export type EntryUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    aiDraft?: Prisma.StringFieldUpdateOperationsInput | string;
    flags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type EntryCreateManyInput = {
    id?: string;
    sessionId: string;
    body: string;
    aiDraft: string;
    flags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Date | string;
    userId: string;
};
export type EntryUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    aiDraft?: Prisma.StringFieldUpdateOperationsInput | string;
    flags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EntryUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    aiDraft?: Prisma.StringFieldUpdateOperationsInput | string;
    flags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type EntryListRelationFilter = {
    every?: Prisma.EntryWhereInput;
    some?: Prisma.EntryWhereInput;
    none?: Prisma.EntryWhereInput;
};
export type EntryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type EntryNullableScalarRelationFilter = {
    is?: Prisma.EntryWhereInput | null;
    isNot?: Prisma.EntryWhereInput | null;
};
export type EntryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sessionId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    aiDraft?: Prisma.SortOrder;
    flags?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type EntryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sessionId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    aiDraft?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type EntryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sessionId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    aiDraft?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type EntryCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.EntryCreateWithoutUserInput, Prisma.EntryUncheckedCreateWithoutUserInput> | Prisma.EntryCreateWithoutUserInput[] | Prisma.EntryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.EntryCreateOrConnectWithoutUserInput | Prisma.EntryCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.EntryCreateManyUserInputEnvelope;
    connect?: Prisma.EntryWhereUniqueInput | Prisma.EntryWhereUniqueInput[];
};
export type EntryUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.EntryCreateWithoutUserInput, Prisma.EntryUncheckedCreateWithoutUserInput> | Prisma.EntryCreateWithoutUserInput[] | Prisma.EntryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.EntryCreateOrConnectWithoutUserInput | Prisma.EntryCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.EntryCreateManyUserInputEnvelope;
    connect?: Prisma.EntryWhereUniqueInput | Prisma.EntryWhereUniqueInput[];
};
export type EntryUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.EntryCreateWithoutUserInput, Prisma.EntryUncheckedCreateWithoutUserInput> | Prisma.EntryCreateWithoutUserInput[] | Prisma.EntryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.EntryCreateOrConnectWithoutUserInput | Prisma.EntryCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.EntryUpsertWithWhereUniqueWithoutUserInput | Prisma.EntryUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.EntryCreateManyUserInputEnvelope;
    set?: Prisma.EntryWhereUniqueInput | Prisma.EntryWhereUniqueInput[];
    disconnect?: Prisma.EntryWhereUniqueInput | Prisma.EntryWhereUniqueInput[];
    delete?: Prisma.EntryWhereUniqueInput | Prisma.EntryWhereUniqueInput[];
    connect?: Prisma.EntryWhereUniqueInput | Prisma.EntryWhereUniqueInput[];
    update?: Prisma.EntryUpdateWithWhereUniqueWithoutUserInput | Prisma.EntryUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.EntryUpdateManyWithWhereWithoutUserInput | Prisma.EntryUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.EntryScalarWhereInput | Prisma.EntryScalarWhereInput[];
};
export type EntryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.EntryCreateWithoutUserInput, Prisma.EntryUncheckedCreateWithoutUserInput> | Prisma.EntryCreateWithoutUserInput[] | Prisma.EntryUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.EntryCreateOrConnectWithoutUserInput | Prisma.EntryCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.EntryUpsertWithWhereUniqueWithoutUserInput | Prisma.EntryUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.EntryCreateManyUserInputEnvelope;
    set?: Prisma.EntryWhereUniqueInput | Prisma.EntryWhereUniqueInput[];
    disconnect?: Prisma.EntryWhereUniqueInput | Prisma.EntryWhereUniqueInput[];
    delete?: Prisma.EntryWhereUniqueInput | Prisma.EntryWhereUniqueInput[];
    connect?: Prisma.EntryWhereUniqueInput | Prisma.EntryWhereUniqueInput[];
    update?: Prisma.EntryUpdateWithWhereUniqueWithoutUserInput | Prisma.EntryUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.EntryUpdateManyWithWhereWithoutUserInput | Prisma.EntryUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.EntryScalarWhereInput | Prisma.EntryScalarWhereInput[];
};
export type EntryCreateNestedOneWithoutSessionInput = {
    create?: Prisma.XOR<Prisma.EntryCreateWithoutSessionInput, Prisma.EntryUncheckedCreateWithoutSessionInput>;
    connectOrCreate?: Prisma.EntryCreateOrConnectWithoutSessionInput;
    connect?: Prisma.EntryWhereUniqueInput;
};
export type EntryUncheckedCreateNestedOneWithoutSessionInput = {
    create?: Prisma.XOR<Prisma.EntryCreateWithoutSessionInput, Prisma.EntryUncheckedCreateWithoutSessionInput>;
    connectOrCreate?: Prisma.EntryCreateOrConnectWithoutSessionInput;
    connect?: Prisma.EntryWhereUniqueInput;
};
export type EntryUpdateOneWithoutSessionNestedInput = {
    create?: Prisma.XOR<Prisma.EntryCreateWithoutSessionInput, Prisma.EntryUncheckedCreateWithoutSessionInput>;
    connectOrCreate?: Prisma.EntryCreateOrConnectWithoutSessionInput;
    upsert?: Prisma.EntryUpsertWithoutSessionInput;
    disconnect?: Prisma.EntryWhereInput | boolean;
    delete?: Prisma.EntryWhereInput | boolean;
    connect?: Prisma.EntryWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EntryUpdateToOneWithWhereWithoutSessionInput, Prisma.EntryUpdateWithoutSessionInput>, Prisma.EntryUncheckedUpdateWithoutSessionInput>;
};
export type EntryUncheckedUpdateOneWithoutSessionNestedInput = {
    create?: Prisma.XOR<Prisma.EntryCreateWithoutSessionInput, Prisma.EntryUncheckedCreateWithoutSessionInput>;
    connectOrCreate?: Prisma.EntryCreateOrConnectWithoutSessionInput;
    upsert?: Prisma.EntryUpsertWithoutSessionInput;
    disconnect?: Prisma.EntryWhereInput | boolean;
    delete?: Prisma.EntryWhereInput | boolean;
    connect?: Prisma.EntryWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EntryUpdateToOneWithWhereWithoutSessionInput, Prisma.EntryUpdateWithoutSessionInput>, Prisma.EntryUncheckedUpdateWithoutSessionInput>;
};
export type EntryCreateWithoutUserInput = {
    id?: string;
    body: string;
    aiDraft: string;
    flags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Date | string;
    Session?: Prisma.DailySessionCreateNestedOneWithoutEntryInput;
};
export type EntryUncheckedCreateWithoutUserInput = {
    id?: string;
    sessionId: string;
    body: string;
    aiDraft: string;
    flags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Date | string;
};
export type EntryCreateOrConnectWithoutUserInput = {
    where: Prisma.EntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.EntryCreateWithoutUserInput, Prisma.EntryUncheckedCreateWithoutUserInput>;
};
export type EntryCreateManyUserInputEnvelope = {
    data: Prisma.EntryCreateManyUserInput | Prisma.EntryCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type EntryUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.EntryWhereUniqueInput;
    update: Prisma.XOR<Prisma.EntryUpdateWithoutUserInput, Prisma.EntryUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.EntryCreateWithoutUserInput, Prisma.EntryUncheckedCreateWithoutUserInput>;
};
export type EntryUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.EntryWhereUniqueInput;
    data: Prisma.XOR<Prisma.EntryUpdateWithoutUserInput, Prisma.EntryUncheckedUpdateWithoutUserInput>;
};
export type EntryUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.EntryScalarWhereInput;
    data: Prisma.XOR<Prisma.EntryUpdateManyMutationInput, Prisma.EntryUncheckedUpdateManyWithoutUserInput>;
};
export type EntryScalarWhereInput = {
    AND?: Prisma.EntryScalarWhereInput | Prisma.EntryScalarWhereInput[];
    OR?: Prisma.EntryScalarWhereInput[];
    NOT?: Prisma.EntryScalarWhereInput | Prisma.EntryScalarWhereInput[];
    id?: Prisma.StringFilter<"Entry"> | string;
    sessionId?: Prisma.StringFilter<"Entry"> | string;
    body?: Prisma.StringFilter<"Entry"> | string;
    aiDraft?: Prisma.StringFilter<"Entry"> | string;
    flags?: Prisma.JsonNullableFilter<"Entry">;
    updatedAt?: Prisma.DateTimeFilter<"Entry"> | Date | string;
    userId?: Prisma.StringFilter<"Entry"> | string;
};
export type EntryCreateWithoutSessionInput = {
    id?: string;
    body: string;
    aiDraft: string;
    flags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Date | string;
    User: Prisma.UserCreateNestedOneWithoutEntriesInput;
};
export type EntryUncheckedCreateWithoutSessionInput = {
    id?: string;
    body: string;
    aiDraft: string;
    flags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Date | string;
    userId: string;
};
export type EntryCreateOrConnectWithoutSessionInput = {
    where: Prisma.EntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.EntryCreateWithoutSessionInput, Prisma.EntryUncheckedCreateWithoutSessionInput>;
};
export type EntryUpsertWithoutSessionInput = {
    update: Prisma.XOR<Prisma.EntryUpdateWithoutSessionInput, Prisma.EntryUncheckedUpdateWithoutSessionInput>;
    create: Prisma.XOR<Prisma.EntryCreateWithoutSessionInput, Prisma.EntryUncheckedCreateWithoutSessionInput>;
    where?: Prisma.EntryWhereInput;
};
export type EntryUpdateToOneWithWhereWithoutSessionInput = {
    where?: Prisma.EntryWhereInput;
    data: Prisma.XOR<Prisma.EntryUpdateWithoutSessionInput, Prisma.EntryUncheckedUpdateWithoutSessionInput>;
};
export type EntryUpdateWithoutSessionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    aiDraft?: Prisma.StringFieldUpdateOperationsInput | string;
    flags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    User?: Prisma.UserUpdateOneRequiredWithoutEntriesNestedInput;
};
export type EntryUncheckedUpdateWithoutSessionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    aiDraft?: Prisma.StringFieldUpdateOperationsInput | string;
    flags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type EntryCreateManyUserInput = {
    id?: string;
    sessionId: string;
    body: string;
    aiDraft: string;
    flags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Date | string;
};
export type EntryUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    aiDraft?: Prisma.StringFieldUpdateOperationsInput | string;
    flags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    Session?: Prisma.DailySessionUpdateOneWithoutEntryNestedInput;
};
export type EntryUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    aiDraft?: Prisma.StringFieldUpdateOperationsInput | string;
    flags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EntryUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    aiDraft?: Prisma.StringFieldUpdateOperationsInput | string;
    flags?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EntrySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sessionId?: boolean;
    body?: boolean;
    aiDraft?: boolean;
    flags?: boolean;
    updatedAt?: boolean;
    userId?: boolean;
    Session?: boolean | Prisma.Entry$SessionArgs<ExtArgs>;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["entry"]>;
export type EntrySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sessionId?: boolean;
    body?: boolean;
    aiDraft?: boolean;
    flags?: boolean;
    updatedAt?: boolean;
    userId?: boolean;
    Session?: boolean | Prisma.Entry$SessionArgs<ExtArgs>;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["entry"]>;
export type EntrySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sessionId?: boolean;
    body?: boolean;
    aiDraft?: boolean;
    flags?: boolean;
    updatedAt?: boolean;
    userId?: boolean;
    Session?: boolean | Prisma.Entry$SessionArgs<ExtArgs>;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["entry"]>;
export type EntrySelectScalar = {
    id?: boolean;
    sessionId?: boolean;
    body?: boolean;
    aiDraft?: boolean;
    flags?: boolean;
    updatedAt?: boolean;
    userId?: boolean;
};
export type EntryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "sessionId" | "body" | "aiDraft" | "flags" | "updatedAt" | "userId", ExtArgs["result"]["entry"]>;
export type EntryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    Session?: boolean | Prisma.Entry$SessionArgs<ExtArgs>;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type EntryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    Session?: boolean | Prisma.Entry$SessionArgs<ExtArgs>;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type EntryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    Session?: boolean | Prisma.Entry$SessionArgs<ExtArgs>;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $EntryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Entry";
    objects: {
        Session: Prisma.$DailySessionPayload<ExtArgs> | null;
        User: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        sessionId: string;
        body: string;
        aiDraft: string;
        flags: runtime.JsonValue | null;
        updatedAt: Date;
        userId: string;
    }, ExtArgs["result"]["entry"]>;
    composites: {};
};
export type EntryGetPayload<S extends boolean | null | undefined | EntryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EntryPayload, S>;
export type EntryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EntryCountAggregateInputType | true;
};
export interface EntryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Entry'];
        meta: {
            name: 'Entry';
        };
    };
    findUnique<T extends EntryFindUniqueArgs>(args: Prisma.SelectSubset<T, EntryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EntryClient<runtime.Types.Result.GetResult<Prisma.$EntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EntryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EntryClient<runtime.Types.Result.GetResult<Prisma.$EntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EntryFindFirstArgs>(args?: Prisma.SelectSubset<T, EntryFindFirstArgs<ExtArgs>>): Prisma.Prisma__EntryClient<runtime.Types.Result.GetResult<Prisma.$EntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EntryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EntryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EntryClient<runtime.Types.Result.GetResult<Prisma.$EntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EntryFindManyArgs>(args?: Prisma.SelectSubset<T, EntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EntryCreateArgs>(args: Prisma.SelectSubset<T, EntryCreateArgs<ExtArgs>>): Prisma.Prisma__EntryClient<runtime.Types.Result.GetResult<Prisma.$EntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EntryCreateManyArgs>(args?: Prisma.SelectSubset<T, EntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EntryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EntryDeleteArgs>(args: Prisma.SelectSubset<T, EntryDeleteArgs<ExtArgs>>): Prisma.Prisma__EntryClient<runtime.Types.Result.GetResult<Prisma.$EntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EntryUpdateArgs>(args: Prisma.SelectSubset<T, EntryUpdateArgs<ExtArgs>>): Prisma.Prisma__EntryClient<runtime.Types.Result.GetResult<Prisma.$EntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EntryDeleteManyArgs>(args?: Prisma.SelectSubset<T, EntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EntryUpdateManyArgs>(args: Prisma.SelectSubset<T, EntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EntryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EntryUpsertArgs>(args: Prisma.SelectSubset<T, EntryUpsertArgs<ExtArgs>>): Prisma.Prisma__EntryClient<runtime.Types.Result.GetResult<Prisma.$EntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EntryCountArgs>(args?: Prisma.Subset<T, EntryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EntryCountAggregateOutputType> : number>;
    aggregate<T extends EntryAggregateArgs>(args: Prisma.Subset<T, EntryAggregateArgs>): Prisma.PrismaPromise<GetEntryAggregateType<T>>;
    groupBy<T extends EntryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EntryGroupByArgs['orderBy'];
    } : {
        orderBy?: EntryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EntryFieldRefs;
}
export interface Prisma__EntryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    Session<T extends Prisma.Entry$SessionArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Entry$SessionArgs<ExtArgs>>): Prisma.Prisma__DailySessionClient<runtime.Types.Result.GetResult<Prisma.$DailySessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    User<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EntryFieldRefs {
    readonly id: Prisma.FieldRef<"Entry", 'String'>;
    readonly sessionId: Prisma.FieldRef<"Entry", 'String'>;
    readonly body: Prisma.FieldRef<"Entry", 'String'>;
    readonly aiDraft: Prisma.FieldRef<"Entry", 'String'>;
    readonly flags: Prisma.FieldRef<"Entry", 'Json'>;
    readonly updatedAt: Prisma.FieldRef<"Entry", 'DateTime'>;
    readonly userId: Prisma.FieldRef<"Entry", 'String'>;
}
export type EntryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntrySelect<ExtArgs> | null;
    omit?: Prisma.EntryOmit<ExtArgs> | null;
    include?: Prisma.EntryInclude<ExtArgs> | null;
    where: Prisma.EntryWhereUniqueInput;
};
export type EntryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntrySelect<ExtArgs> | null;
    omit?: Prisma.EntryOmit<ExtArgs> | null;
    include?: Prisma.EntryInclude<ExtArgs> | null;
    where: Prisma.EntryWhereUniqueInput;
};
export type EntryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EntryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EntryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EntryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntrySelect<ExtArgs> | null;
    omit?: Prisma.EntryOmit<ExtArgs> | null;
    include?: Prisma.EntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EntryCreateInput, Prisma.EntryUncheckedCreateInput>;
};
export type EntryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EntryCreateManyInput | Prisma.EntryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EntryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntrySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EntryOmit<ExtArgs> | null;
    data: Prisma.EntryCreateManyInput | Prisma.EntryCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.EntryIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type EntryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntrySelect<ExtArgs> | null;
    omit?: Prisma.EntryOmit<ExtArgs> | null;
    include?: Prisma.EntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EntryUpdateInput, Prisma.EntryUncheckedUpdateInput>;
    where: Prisma.EntryWhereUniqueInput;
};
export type EntryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EntryUpdateManyMutationInput, Prisma.EntryUncheckedUpdateManyInput>;
    where?: Prisma.EntryWhereInput;
    limit?: number;
};
export type EntryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntrySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EntryUpdateManyMutationInput, Prisma.EntryUncheckedUpdateManyInput>;
    where?: Prisma.EntryWhereInput;
    limit?: number;
    include?: Prisma.EntryIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type EntryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntrySelect<ExtArgs> | null;
    omit?: Prisma.EntryOmit<ExtArgs> | null;
    include?: Prisma.EntryInclude<ExtArgs> | null;
    where: Prisma.EntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.EntryCreateInput, Prisma.EntryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EntryUpdateInput, Prisma.EntryUncheckedUpdateInput>;
};
export type EntryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntrySelect<ExtArgs> | null;
    omit?: Prisma.EntryOmit<ExtArgs> | null;
    include?: Prisma.EntryInclude<ExtArgs> | null;
    where: Prisma.EntryWhereUniqueInput;
};
export type EntryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EntryWhereInput;
    limit?: number;
};
export type Entry$SessionArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DailySessionSelect<ExtArgs> | null;
    omit?: Prisma.DailySessionOmit<ExtArgs> | null;
    include?: Prisma.DailySessionInclude<ExtArgs> | null;
    where?: Prisma.DailySessionWhereInput;
};
export type EntryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntrySelect<ExtArgs> | null;
    omit?: Prisma.EntryOmit<ExtArgs> | null;
    include?: Prisma.EntryInclude<ExtArgs> | null;
};
