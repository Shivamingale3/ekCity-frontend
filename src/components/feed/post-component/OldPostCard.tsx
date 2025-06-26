// import { useAuth } from "@/context/AuthContext";
// import { UserRole } from "@/types/authTypes";
// import type { PostData } from "@/types/postTypes";
// import {
//   formatTimestamp,
//   getFormattedText,
//   getInitials,
// } from "@/utils/universalFunctions";
// import {
//   AlertTriangle,
//   Globe,
//   Heart,
//   MessageCircle,
//   MoreHorizontal,
//   Share2,
//   Star,
//   ThumbsUp,
//   Trash2,
// } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
// import { Badge } from "../../ui/badge";
// import { Button } from "../../ui/button";
// import { Card, CardContent, CardFooter, CardHeader } from "../../ui/card";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "../../ui/carousel";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../../ui/dropdown-menu";
// import { useEffect, useState } from "react";

// function PostComponent({ postData }: { postData: PostData }) {
//   const { state } = useAuth();
//   const [expanded, setExpanded] = useState<boolean>(false);
//   const [content, setContent] = useState<string>(
//     postData.postContent.split(" ").length > 100
//       ? getFormattedText({ text: postData.postContent, limit: 250 })
//       : postData.postContent
//   );
//   const isOwnPost = state.user && state.user.id === postData.author?.id;

//   useEffect(() => {
//     if (expanded) {
//       setContent(postData.postContent);
//     } else {
//       setContent(
//         postData.postContent.split(" ").length > 100
//           ? getFormattedText({ text: postData.postContent, limit: 250 })
//           : postData.postContent
//       );
//     }
//   }, [expanded]);

//   return (
//     <Card className="w-full max-w-[95%] xs:max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%] xl:max-w-[60%] 2xl:max-w-[55%] transition-all hover:shadow-md mx-auto">
//       <CardHeader className="p-3 sm:p-4 pb-0">
//         <div className="flex justify-between items-start gap-2">
//           <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
//             <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
//               <AvatarImage
//                 src={postData.author?.profilePicture ?? ""}
//                 alt={postData.author?.firstName ?? ""}
//               />
//               <AvatarFallback className="text-xs sm:text-sm">
//                 {getInitials(postData.author?.firstName ?? "")}
//               </AvatarFallback>
//             </Avatar>

//             <div className="min-w-0 flex-1">
//               <div className="flex items-center flex-wrap gap-1 sm:gap-2">
//                 <span className="font-semibold text-sm sm:text-base truncate">
//                   {postData.author?.firstName}
//                 </span>
//                 {postData.author?.role === UserRole.GOVERNMENT && (
//                   <Badge
//                     variant="outline"
//                     className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex-shrink-0"
//                   >
//                     Government
//                   </Badge>
//                 )}
//                 {postData.author?.role === UserRole.PRIVATE && (
//                   <Badge
//                     variant="outline"
//                     className="text-xs bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex-shrink-0"
//                   >
//                     Verified
//                   </Badge>
//                 )}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 {formatTimestamp(postData.createdAt.toString())}
//               </p>
//             </div>
//           </div>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="rounded-full h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0"
//               >
//                 <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-48">
//               <DropdownMenuItem onClick={() => null}>
//                 <Globe className="h-4 w-4 mr-2" />
//                 Show Original
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               {isOwnPost ? (
//                 <DropdownMenuItem className="text-destructive">
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Delete post
//                 </DropdownMenuItem>
//               ) : (
//                 <DropdownMenuItem className="text-destructive">
//                   <AlertTriangle className="h-4 w-4 mr-2" />
//                   Report post
//                 </DropdownMenuItem>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         <div className="mt-2">
//           <Badge variant="secondary" className="text-xs">
//             {postData.postCategory.replace("_", " ")}
//           </Badge>

//           {postData.collaborators && postData.collaborators.length > 0 && (
//             <div className="flex items-start mt-2 text-xs text-muted-foreground">
//               <span className="flex-shrink-0">In collaboration with:</span>
//               <div className="flex flex-wrap ml-1">
//                 {postData.collaborators.map((collaborator, index) => (
//                   <span key={collaborator?.id} className="font-medium">
//                     {collaborator?.firstName}
//                     {index < postData.collaborators!.length - 1 ? ", " : ""}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </CardHeader>

//       <CardContent className="p-3 sm:p-4">
//         <p className="whitespace-pre-line mb-3 text-sm sm:text-base leading-relaxed">
//           {content}
//           <Button
//             variant={"ghost"}
//             className="hover:bg-transparent text-blue-700 hover:text-blue-700 hover:underline"
//             onClick={() => setExpanded(!expanded)}
//           >
//             {expanded ? "View Less " : "View More"}
//           </Button>
//         </p>

//         {postData.postImageUrls && postData.postImageUrls.length > 0 && (
//           <div className="mt-3 rounded-md overflow-hidden">
//             {postData.postImageUrls.length === 1 ? (
//               <div className="relative">
//                 {postData.postImageUrls[0] === "image" ? (
//                   <img
//                     src={postData.postImageUrls[0]}
//                     alt={postData.postImageUrls[0] || "Post image"}
//                     className="w-full h-auto rounded-md object-cover max-h-[250px] sm:max-h-[350px] md:max-h-[400px]"
//                   />
//                 ) : (
//                   <video
//                     src={postData.postImageUrls[0]}
//                     controls
//                     className="w-full h-auto rounded-md max-h-[250px] sm:max-h-[350px] md:max-h-[400px]"
//                   />
//                 )}
//               </div>
//             ) : (
//               <Carousel className="w-full">
//                 <CarouselContent>
//                   {postData.postImageUrls.map((item, index) => (
//                     <CarouselItem key={index}>
//                       <div className="relative">
//                         <img
//                           src={item}
//                           alt="Post image"
//                           className="w-full h-auto rounded-md object-cover max-h-[250px] sm:max-h-[350px] md:max-h-[400px]"
//                         />
//                       </div>
//                     </CarouselItem>
//                   ))}
//                 </CarouselContent>
//                 <CarouselPrevious className="left-1 sm:left-2 h-6 w-6 sm:h-8 sm:w-8" />
//                 <CarouselNext className="right-1 sm:right-2 h-6 w-6 sm:h-8 sm:w-8" />
//               </Carousel>
//             )}
//           </div>
//         )}

//         {postData.postTags && postData.postTags.length > 0 && (
//           <div className="flex flex-wrap gap-1 sm:gap-2 mt-4">
//             {postData.postTags.map((tag) => (
//               <span key={tag} className="text-xs sm:text-sm text-primary">
//                 #{tag}
//               </span>
//             ))}
//           </div>
//         )}
//       </CardContent>

//       <CardFooter className="border-t p-2 sm:p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
//         {/* Reaction Buttons */}
//         <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
//           <Button
//             size="sm"
//             className="h-7 sm:h-8 text-xs sm:text-sm flex-shrink-0 px-2 sm:px-3"
//           >
//             <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
//             <span className="hidden xs:inline">Like</span>
//           </Button>
//           <Button
//             size="sm"
//             className="h-7 sm:h-8 text-xs sm:text-sm flex-shrink-0 px-2 sm:px-3"
//           >
//             <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
//             <span className="hidden xs:inline">Love</span>
//           </Button>
//           <Button
//             size="sm"
//             className="h-7 sm:h-8 text-xs sm:text-sm flex-shrink-0 px-2 sm:px-3"
//           >
//             <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
//             <span className="hidden sm:inline">Important</span>
//             <span className="sm:hidden">★</span>
//           </Button>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex items-center gap-1 sm:gap-2 justify-end">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
//           >
//             <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
//             <span className="hidden xs:inline">Comment</span>
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
//           >
//             <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
//             <span className="hidden xs:inline">Share</span>
//           </Button>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

// export default PostComponent;
