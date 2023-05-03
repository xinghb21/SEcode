import React, { useState } from "react";
import { Input, Tag } from "antd";

const { CheckableTag } = Tag;

const tagsData = ["Movies", "Books", "Music", "Sports"];

const App: React.FC = () => {

    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleChange = (tag: string, checked: boolean) => {
        const nextSelectedTags = checked
            ? [...selectedTags, tag]
            : selectedTags.filter((t) => t !== tag);
        setSelectedTags(nextSelectedTags);
    };

    return (
        <>
            <div>
                <Input
                    style={{ width: 300, marginBottom: 16 }}
                    value={selectedTags.join("，")}
                    onChange={(e) => {
                        const value = e.target.value;
                        const tags = value.split("，");
                        setSelectedTags(tags);
                    }}
                >
                </Input>
            </div>
            {tagsData.map((tag) => (
                <CheckableTag
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    style={{ fontSize: 16 }}
                    onChange={(checked) => handleChange(tag, checked)}
                >
                    {tag}
                </CheckableTag>
            ))}
        </>
    );
};

export default App;