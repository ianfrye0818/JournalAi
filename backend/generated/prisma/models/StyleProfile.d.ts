import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type StyleProfileModel = runtime.Types.Result.DefaultSelection<Prisma.$StyleProfilePayload>;
export type AggregateStyleProfile = {
    _count: StyleProfileCountAggregateOutputType | null;
    _min: StyleProfileMinAggregateOutputType | null;
    _max: StyleProfileMaxAggregateOutputType | null;
};
export type StyleProfileMinAggregateOutputType = {
    id: string | null;
    samples: string | null;
    notes: string | null;
    userId: string | null;
};
export type StyleProfileMaxAggregateOutputType = {
    id: string | null;
    samples: string | null;
    notes: string | null;
    userId: string | null;
};
export type StyleProfileCountAggregateOutputType = {
    id: number;
    samples: number;
    notes: number;
    userId: number;
    _all: number;
};
export type StyleProfileMinAggregateInputType = {
    id?: true;
    samples?: true;
    notes?: true;
    userId?: true;
};
export type StyleProfileMaxAggregateInputType = {
    id?: true;
    samples?: true;
    notes?: true;
    userId?: true;
};
export type StyleProfileCountAggregateInputType = {
    id?: true;
    samples?: true;
    notes?: true;
    userId?: true;
    _all?: true;
};
export type StyleProfileAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StyleProfileWhereInput;
    orderBy?: Prisma.StyleProfileOrderByWithRelationInput | Prisma.StyleProfileOrderByWithRelationInput[];
    cursor?: Prisma.StyleProfileWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StyleProfileCountAggregateInputType;
    _min?: StyleProfileMinAggregateInputType;
    _max?: StyleProfileMaxAggregateInputType;
};
export type GetStyleProfileAggregateType<T extends StyleProfileAggregateArgs> = {
    [P in keyof T & keyof AggregateStyleProfile]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStyleProfile[P]> : Prisma.GetScalarType<T[P], AggregateStyleProfile[P]>;
};
export type StyleProfileGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StyleProfileWhereInput;
    orderBy?: Prisma.StyleProfileOrderByWithAggregationInput | Prisma.StyleProfileOrderByWithAggregationInput[];
    by: Prisma.StyleProfileScalarFieldEnum[] | Prisma.StyleProfileScalarFieldEnum;
    having?: Prisma.StyleProfileScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StyleProfileCountAggregateInputType | true;
    _min?: StyleProfileMinAggregateInputType;
    _max?: StyleProfileMaxAggregateInputType;
};
export type StyleProfileGroupByOutputType = {
    id: string;
    samples: string;
    notes: string | null;
    userId: string;
    _count: StyleProfileCountAggregateOutputType | null;
    _min: StyleProfileMinAggregateOutputType | null;
    _max: StyleProfileMaxAggregateOutputType | null;
};
export type GetStyleProfileGroupByPayload<T extends StyleProfileGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StyleProfileGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StyleProfileGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StyleProfileGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StyleProfileGroupByOutputType[P]>;
}>>;
export type StyleProfileWhereInput = {
    AND?: Prisma.StyleProfileWhereInput | Prisma.StyleProfileWhereInput[];
    OR?: Prisma.StyleProfileWhereInput[];
    NOT?: Prisma.StyleProfileWhereInput | Prisma.StyleProfileWhereInput[];
    id?: Prisma.StringFilter<"StyleProfile"> | string;
    samples?: Prisma.StringFilter<"StyleProfile"> | string;
    notes?: Prisma.StringNullableFilter<"StyleProfile"> | string | null;
    userId?: Prisma.StringFilter<"StyleProfile"> | string;
    User?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type StyleProfileOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    samples?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    User?: Prisma.UserOrderByWithRelationInput;
};
export type StyleProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.StyleProfileWhereInput | Prisma.StyleProfileWhereInput[];
    OR?: Prisma.StyleProfileWhereInput[];
    NOT?: Prisma.StyleProfileWhereInput | Prisma.StyleProfileWhereInput[];
    samples?: Prisma.StringFilter<"StyleProfile"> | string;
    notes?: Prisma.StringNullableFilter<"StyleProfile"> | string | null;
    userId?: Prisma.StringFilter<"StyleProfile"> | string;
    User?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type StyleProfileOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    samples?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    _count?: Prisma.StyleProfileCountOrderByAggregateInput;
    _max?: Prisma.StyleProfileMaxOrderByAggregateInput;
    _min?: Prisma.StyleProfileMinOrderByAggregateInput;
};
export type StyleProfileScalarWhereWithAggregatesInput = {
    AND?: Prisma.StyleProfileScalarWhereWithAggregatesInput | Prisma.StyleProfileScalarWhereWithAggregatesInput[];
    OR?: Prisma.StyleProfileScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StyleProfileScalarWhereWithAggregatesInput | Prisma.StyleProfileScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"StyleProfile"> | string;
    samples?: Prisma.StringWithAggregatesFilter<"StyleProfile"> | string;
    notes?: Prisma.StringNullableWithAggregatesFilter<"StyleProfile"> | string | null;
    userId?: Prisma.StringWithAggregatesFilter<"StyleProfile"> | string;
};
export type StyleProfileCreateInput = {
    id?: string;
    samples: string;
    notes?: string | null;
    User: Prisma.UserCreateNestedOneWithoutStyleProfilesInput;
};
export type StyleProfileUncheckedCreateInput = {
    id?: string;
    samples: string;
    notes?: string | null;
    userId: string;
};
export type StyleProfileUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    samples?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    User?: Prisma.UserUpdateOneRequiredWithoutStyleProfilesNestedInput;
};
export type StyleProfileUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    samples?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type StyleProfileCreateManyInput = {
    id?: string;
    samples: string;
    notes?: string | null;
    userId: string;
};
export type StyleProfileUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    samples?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type StyleProfileUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    samples?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type StyleProfileListRelationFilter = {
    every?: Prisma.StyleProfileWhereInput;
    some?: Prisma.StyleProfileWhereInput;
    none?: Prisma.StyleProfileWhereInput;
};
export type StyleProfileOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StyleProfileCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    samples?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type StyleProfileMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    samples?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type StyleProfileMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    samples?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type StyleProfileCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.StyleProfileCreateWithoutUserInput, Prisma.StyleProfileUncheckedCreateWithoutUserInput> | Prisma.StyleProfileCreateWithoutUserInput[] | Prisma.StyleProfileUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.StyleProfileCreateOrConnectWithoutUserInput | Prisma.StyleProfileCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.StyleProfileCreateManyUserInputEnvelope;
    connect?: Prisma.StyleProfileWhereUniqueInput | Prisma.StyleProfileWhereUniqueInput[];
};
export type StyleProfileUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.StyleProfileCreateWithoutUserInput, Prisma.StyleProfileUncheckedCreateWithoutUserInput> | Prisma.StyleProfileCreateWithoutUserInput[] | Prisma.StyleProfileUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.StyleProfileCreateOrConnectWithoutUserInput | Prisma.StyleProfileCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.StyleProfileCreateManyUserInputEnvelope;
    connect?: Prisma.StyleProfileWhereUniqueInput | Prisma.StyleProfileWhereUniqueInput[];
};
export type StyleProfileUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.StyleProfileCreateWithoutUserInput, Prisma.StyleProfileUncheckedCreateWithoutUserInput> | Prisma.StyleProfileCreateWithoutUserInput[] | Prisma.StyleProfileUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.StyleProfileCreateOrConnectWithoutUserInput | Prisma.StyleProfileCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.StyleProfileUpsertWithWhereUniqueWithoutUserInput | Prisma.StyleProfileUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.StyleProfileCreateManyUserInputEnvelope;
    set?: Prisma.StyleProfileWhereUniqueInput | Prisma.StyleProfileWhereUniqueInput[];
    disconnect?: Prisma.StyleProfileWhereUniqueInput | Prisma.StyleProfileWhereUniqueInput[];
    delete?: Prisma.StyleProfileWhereUniqueInput | Prisma.StyleProfileWhereUniqueInput[];
    connect?: Prisma.StyleProfileWhereUniqueInput | Prisma.StyleProfileWhereUniqueInput[];
    update?: Prisma.StyleProfileUpdateWithWhereUniqueWithoutUserInput | Prisma.StyleProfileUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.StyleProfileUpdateManyWithWhereWithoutUserInput | Prisma.StyleProfileUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.StyleProfileScalarWhereInput | Prisma.StyleProfileScalarWhereInput[];
};
export type StyleProfileUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.StyleProfileCreateWithoutUserInput, Prisma.StyleProfileUncheckedCreateWithoutUserInput> | Prisma.StyleProfileCreateWithoutUserInput[] | Prisma.StyleProfileUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.StyleProfileCreateOrConnectWithoutUserInput | Prisma.StyleProfileCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.StyleProfileUpsertWithWhereUniqueWithoutUserInput | Prisma.StyleProfileUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.StyleProfileCreateManyUserInputEnvelope;
    set?: Prisma.StyleProfileWhereUniqueInput | Prisma.StyleProfileWhereUniqueInput[];
    disconnect?: Prisma.StyleProfileWhereUniqueInput | Prisma.StyleProfileWhereUniqueInput[];
    delete?: Prisma.StyleProfileWhereUniqueInput | Prisma.StyleProfileWhereUniqueInput[];
    connect?: Prisma.StyleProfileWhereUniqueInput | Prisma.StyleProfileWhereUniqueInput[];
    update?: Prisma.StyleProfileUpdateWithWhereUniqueWithoutUserInput | Prisma.StyleProfileUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.StyleProfileUpdateManyWithWhereWithoutUserInput | Prisma.StyleProfileUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.StyleProfileScalarWhereInput | Prisma.StyleProfileScalarWhereInput[];
};
export type StyleProfileCreateWithoutUserInput = {
    id?: string;
    samples: string;
    notes?: string | null;
};
export type StyleProfileUncheckedCreateWithoutUserInput = {
    id?: string;
    samples: string;
    notes?: string | null;
};
export type StyleProfileCreateOrConnectWithoutUserInput = {
    where: Prisma.StyleProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.StyleProfileCreateWithoutUserInput, Prisma.StyleProfileUncheckedCreateWithoutUserInput>;
};
export type StyleProfileCreateManyUserInputEnvelope = {
    data: Prisma.StyleProfileCreateManyUserInput | Prisma.StyleProfileCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type StyleProfileUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.StyleProfileWhereUniqueInput;
    update: Prisma.XOR<Prisma.StyleProfileUpdateWithoutUserInput, Prisma.StyleProfileUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.StyleProfileCreateWithoutUserInput, Prisma.StyleProfileUncheckedCreateWithoutUserInput>;
};
export type StyleProfileUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.StyleProfileWhereUniqueInput;
    data: Prisma.XOR<Prisma.StyleProfileUpdateWithoutUserInput, Prisma.StyleProfileUncheckedUpdateWithoutUserInput>;
};
export type StyleProfileUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.StyleProfileScalarWhereInput;
    data: Prisma.XOR<Prisma.StyleProfileUpdateManyMutationInput, Prisma.StyleProfileUncheckedUpdateManyWithoutUserInput>;
};
export type StyleProfileScalarWhereInput = {
    AND?: Prisma.StyleProfileScalarWhereInput | Prisma.StyleProfileScalarWhereInput[];
    OR?: Prisma.StyleProfileScalarWhereInput[];
    NOT?: Prisma.StyleProfileScalarWhereInput | Prisma.StyleProfileScalarWhereInput[];
    id?: Prisma.StringFilter<"StyleProfile"> | string;
    samples?: Prisma.StringFilter<"StyleProfile"> | string;
    notes?: Prisma.StringNullableFilter<"StyleProfile"> | string | null;
    userId?: Prisma.StringFilter<"StyleProfile"> | string;
};
export type StyleProfileCreateManyUserInput = {
    id?: string;
    samples: string;
    notes?: string | null;
};
export type StyleProfileUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    samples?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type StyleProfileUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    samples?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type StyleProfileUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    samples?: Prisma.StringFieldUpdateOperationsInput | string;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type StyleProfileSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    samples?: boolean;
    notes?: boolean;
    userId?: boolean;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["styleProfile"]>;
export type StyleProfileSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    samples?: boolean;
    notes?: boolean;
    userId?: boolean;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["styleProfile"]>;
export type StyleProfileSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    samples?: boolean;
    notes?: boolean;
    userId?: boolean;
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["styleProfile"]>;
export type StyleProfileSelectScalar = {
    id?: boolean;
    samples?: boolean;
    notes?: boolean;
    userId?: boolean;
};
export type StyleProfileOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "samples" | "notes" | "userId", ExtArgs["result"]["styleProfile"]>;
export type StyleProfileInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type StyleProfileIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type StyleProfileIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    User?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $StyleProfilePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "StyleProfile";
    objects: {
        User: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        samples: string;
        notes: string | null;
        userId: string;
    }, ExtArgs["result"]["styleProfile"]>;
    composites: {};
};
export type StyleProfileGetPayload<S extends boolean | null | undefined | StyleProfileDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StyleProfilePayload, S>;
export type StyleProfileCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StyleProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StyleProfileCountAggregateInputType | true;
};
export interface StyleProfileDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['StyleProfile'];
        meta: {
            name: 'StyleProfile';
        };
    };
    findUnique<T extends StyleProfileFindUniqueArgs>(args: Prisma.SelectSubset<T, StyleProfileFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StyleProfileClient<runtime.Types.Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StyleProfileFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StyleProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StyleProfileClient<runtime.Types.Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StyleProfileFindFirstArgs>(args?: Prisma.SelectSubset<T, StyleProfileFindFirstArgs<ExtArgs>>): Prisma.Prisma__StyleProfileClient<runtime.Types.Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StyleProfileFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StyleProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StyleProfileClient<runtime.Types.Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StyleProfileFindManyArgs>(args?: Prisma.SelectSubset<T, StyleProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StyleProfileCreateArgs>(args: Prisma.SelectSubset<T, StyleProfileCreateArgs<ExtArgs>>): Prisma.Prisma__StyleProfileClient<runtime.Types.Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StyleProfileCreateManyArgs>(args?: Prisma.SelectSubset<T, StyleProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StyleProfileCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StyleProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StyleProfileDeleteArgs>(args: Prisma.SelectSubset<T, StyleProfileDeleteArgs<ExtArgs>>): Prisma.Prisma__StyleProfileClient<runtime.Types.Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StyleProfileUpdateArgs>(args: Prisma.SelectSubset<T, StyleProfileUpdateArgs<ExtArgs>>): Prisma.Prisma__StyleProfileClient<runtime.Types.Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StyleProfileDeleteManyArgs>(args?: Prisma.SelectSubset<T, StyleProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StyleProfileUpdateManyArgs>(args: Prisma.SelectSubset<T, StyleProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StyleProfileUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StyleProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StyleProfileUpsertArgs>(args: Prisma.SelectSubset<T, StyleProfileUpsertArgs<ExtArgs>>): Prisma.Prisma__StyleProfileClient<runtime.Types.Result.GetResult<Prisma.$StyleProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StyleProfileCountArgs>(args?: Prisma.Subset<T, StyleProfileCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StyleProfileCountAggregateOutputType> : number>;
    aggregate<T extends StyleProfileAggregateArgs>(args: Prisma.Subset<T, StyleProfileAggregateArgs>): Prisma.PrismaPromise<GetStyleProfileAggregateType<T>>;
    groupBy<T extends StyleProfileGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StyleProfileGroupByArgs['orderBy'];
    } : {
        orderBy?: StyleProfileGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StyleProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStyleProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StyleProfileFieldRefs;
}
export interface Prisma__StyleProfileClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    User<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StyleProfileFieldRefs {
    readonly id: Prisma.FieldRef<"StyleProfile", 'String'>;
    readonly samples: Prisma.FieldRef<"StyleProfile", 'String'>;
    readonly notes: Prisma.FieldRef<"StyleProfile", 'String'>;
    readonly userId: Prisma.FieldRef<"StyleProfile", 'String'>;
}
export type StyleProfileFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StyleProfileSelect<ExtArgs> | null;
    omit?: Prisma.StyleProfileOmit<ExtArgs> | null;
    include?: Prisma.StyleProfileInclude<ExtArgs> | null;
    where: Prisma.StyleProfileWhereUniqueInput;
};
export type StyleProfileFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StyleProfileSelect<ExtArgs> | null;
    omit?: Prisma.StyleProfileOmit<ExtArgs> | null;
    include?: Prisma.StyleProfileInclude<ExtArgs> | null;
    where: Prisma.StyleProfileWhereUniqueInput;
};
export type StyleProfileFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StyleProfileFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StyleProfileFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type StyleProfileCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StyleProfileSelect<ExtArgs> | null;
    omit?: Prisma.StyleProfileOmit<ExtArgs> | null;
    include?: Prisma.StyleProfileInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StyleProfileCreateInput, Prisma.StyleProfileUncheckedCreateInput>;
};
export type StyleProfileCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StyleProfileCreateManyInput | Prisma.StyleProfileCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StyleProfileCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StyleProfileSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StyleProfileOmit<ExtArgs> | null;
    data: Prisma.StyleProfileCreateManyInput | Prisma.StyleProfileCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.StyleProfileIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type StyleProfileUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StyleProfileSelect<ExtArgs> | null;
    omit?: Prisma.StyleProfileOmit<ExtArgs> | null;
    include?: Prisma.StyleProfileInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StyleProfileUpdateInput, Prisma.StyleProfileUncheckedUpdateInput>;
    where: Prisma.StyleProfileWhereUniqueInput;
};
export type StyleProfileUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StyleProfileUpdateManyMutationInput, Prisma.StyleProfileUncheckedUpdateManyInput>;
    where?: Prisma.StyleProfileWhereInput;
    limit?: number;
};
export type StyleProfileUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StyleProfileSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StyleProfileOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StyleProfileUpdateManyMutationInput, Prisma.StyleProfileUncheckedUpdateManyInput>;
    where?: Prisma.StyleProfileWhereInput;
    limit?: number;
    include?: Prisma.StyleProfileIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type StyleProfileUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StyleProfileSelect<ExtArgs> | null;
    omit?: Prisma.StyleProfileOmit<ExtArgs> | null;
    include?: Prisma.StyleProfileInclude<ExtArgs> | null;
    where: Prisma.StyleProfileWhereUniqueInput;
    create: Prisma.XOR<Prisma.StyleProfileCreateInput, Prisma.StyleProfileUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StyleProfileUpdateInput, Prisma.StyleProfileUncheckedUpdateInput>;
};
export type StyleProfileDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StyleProfileSelect<ExtArgs> | null;
    omit?: Prisma.StyleProfileOmit<ExtArgs> | null;
    include?: Prisma.StyleProfileInclude<ExtArgs> | null;
    where: Prisma.StyleProfileWhereUniqueInput;
};
export type StyleProfileDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StyleProfileWhereInput;
    limit?: number;
};
export type StyleProfileDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StyleProfileSelect<ExtArgs> | null;
    omit?: Prisma.StyleProfileOmit<ExtArgs> | null;
    include?: Prisma.StyleProfileInclude<ExtArgs> | null;
};
